# backend/employer_dashboard/proxy_detection_service.py

import requests
import json
import time
import ipaddress
from typing import Dict, List, Optional, Any
from django.conf import settings
from django.utils import timezone
from .models import ProxyScanSession, ProxyAlert, ProxyDetectionRule
import logging

logger = logging.getLogger(__name__)


class ProxyDetectionService:
    """Service class for proxy and VPN detection using multiple free APIs"""
    
    def __init__(self):
        self.apis = {
            'ipapi': {
                'url': 'http://ip-api.com/json/{ip}?fields=status,message,country,regionName,city,lat,lon,timezone,isp,org,as,asname,proxy,hosting',
                'rate_limit': 45,  # requests per minute
                'free': True,
            },
            'vpnapi': {
                'url': 'https://vpnapi.io/api/{ip}',
                'rate_limit': 1000,  # requests per day
                'free': True,
            },
            'proxycheck': {
                'url': 'http://proxycheck.io/v2/{ip}?vpn=1&asn=1&time=1&inf=0&risk=1',
                'rate_limit': 1000,  # requests per day
                'free': True,
            },
            'ipgeolocation': {
                'url': 'https://api.ipgeolocation.io/ipgeo?apiKey={api_key}&ip={ip}&fields=country_name,city,latitude,longitude,timezone_name,isp,organization,is_proxy',
                'rate_limit': 1000,  # requests per day
                'free': True,
                'requires_key': True,
            },
            'ipinfo': {
                'url': 'https://ipinfo.io/{ip}/json',
                'rate_limit': 50000,  # requests per month
                'free': True,
            }
        }
    
    def scan_ip(self, ip_address: str, employer_id: int, candidate_id: int = None, interview_id: int = None, user_agent: str = '') -> ProxyScanSession:
        """
        Perform comprehensive proxy detection scan on IP address
        """
        logger.info(f"🔍 Starting proxy scan for IP: {ip_address}, Employer: {employer_id}")
        
        # Create scan session
        scan_session = ProxyScanSession.objects.create(
            employer_id=employer_id,
            candidate_id=candidate_id,
            interview_id=interview_id,
            ip_address=ip_address,
            user_agent=user_agent,
            scan_status='scanning'
        )
        
        logger.info(f"📝 Created scan session: {scan_session.id}")
        
        try:
            # Validate IP address
            if not self._validate_ip(ip_address):
                raise ValueError(f"Invalid IP address: {ip_address}")
            
            logger.info(f"✅ IP address validation passed: {ip_address}")
            
            # Check if IP is private/local
            if self._is_private_ip(ip_address):
                logger.info(f"🏠 Private IP detected: {ip_address}")
                scan_session.scan_status = 'completed'
                scan_session.risk_level = 'low'
                scan_session.completed_at = timezone.now()
                scan_session.save()
                return scan_session
            
            # Collect data from multiple APIs
            logger.info(f"📡 Collecting data from APIs for: {ip_address}")
            api_results = self._collect_api_data(ip_address)
            logger.info(f"📊 API results collected: {list(api_results.keys())}")
            
            # Analyze results
            analysis = self._analyze_results(api_results, ip_address)
            logger.info(f"🧠 Analysis completed: Risk={analysis['risk_level']}, Threat={analysis['threat_score']}")
            
            # Update scan session with results
            self._update_scan_session(scan_session, analysis, api_results)
            
            # Check custom rules
            self._check_custom_rules(scan_session)
            
            # Generate alerts if needed
            self._generate_alerts(scan_session, analysis)
            
            scan_session.scan_status = 'completed'
            scan_session.completed_at = timezone.now()
            scan_session.save()
            
            logger.info(f"✅ Scan completed successfully for: {ip_address}")
            
        except Exception as e:
            logger.error(f"❌ Proxy scan failed for IP {ip_address}: {str(e)}")
            scan_session.scan_status = 'failed'
            scan_session.completed_at = timezone.now()
            scan_session.save()
            
            # Create error alert
            ProxyAlert.objects.create(
                scan_session=scan_session,
                alert_type='custom_rule',
                severity='critical',
                title='Scan Failed',
                description=f'Proxy detection scan failed: {str(e)}',
                recommendation='Please try scanning again or contact support.'
            )
            
            # Re-raise the exception to be handled by the view
            raise
        
        return scan_session
    
    def _validate_ip(self, ip_address: str) -> bool:
        """Validate IP address format"""
        try:
            ipaddress.ip_address(ip_address)
            return True
        except ValueError:
            return False
    
    def _is_private_ip(self, ip_address: str) -> bool:
        """Check if IP is private/local"""
        try:
            ip = ipaddress.ip_address(ip_address)
            return ip.is_private or ip.is_loopback or ip.is_multicast
        except ValueError:
            return False
    
    def _collect_api_data(self, ip_address: str) -> Dict[str, Any]:
        """Collect data from multiple proxy detection APIs"""
        results = {}
        
        # IP-API.com (Free, no key required)
        try:
            response = self._make_request(self.apis['ipapi']['url'].format(ip=ip_address))
            if response and response.get('status') == 'success':
                results['ipapi'] = response
        except Exception as e:
            logger.warning(f"IP-API request failed: {str(e)}")
        
        # VPN API (Free, no key required)
        try:
            response = self._make_request(self.apis['vpnapi']['url'].format(ip=ip_address))
            if response:
                results['vpnapi'] = response
        except Exception as e:
            logger.warning(f"VPN API request failed: {str(e)}")
        
        # ProxyCheck.io (Free, no key required)
        try:
            response = self._make_request(self.apis['proxycheck']['url'].format(ip=ip_address))
            if response and response.get(ip_address):
                results['proxycheck'] = response[ip_address]
        except Exception as e:
            logger.warning(f"ProxyCheck request failed: {str(e)}")
        
        # IPInfo.io (Free, no key required)
        try:
            response = self._make_request(self.apis['ipinfo']['url'].format(ip=ip_address))
            if response and not response.get('error'):
                results['ipinfo'] = response
        except Exception as e:
            logger.warning(f"IPInfo request failed: {str(e)}")
        
        return results
    
    def _make_request(self, url: str, timeout: int = 10) -> Optional[Dict]:
        """Make HTTP request with error handling"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed for {url}: {str(e)}")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode failed for {url}: {str(e)}")
            return None
    
    def _analyze_results(self, api_results: Dict[str, Any], ip_address: str) -> Dict[str, Any]:
        """Analyze API results and determine proxy status"""
        analysis = {
            'is_proxy': False,
            'is_vpn': False,
            'is_tor': False,
            'is_hosting': False,
            'is_datacenter': False,
            'threat_score': 0,
            'risk_level': 'low',
            'confidence': 0,
            'location': {},
            'isp_info': {},
            'suspicious_indicators': []
        }
        
        proxy_indicators = 0
        total_sources = len(api_results)
        
        # Analyze IP-API results
        if 'ipapi' in api_results:
            data = api_results['ipapi']
            analysis['location'].update({
                'country': data.get('country', ''),
                'region': data.get('regionName', ''),
                'city': data.get('city', ''),
                'latitude': data.get('lat'),
                'longitude': data.get('lon'),
                'timezone': data.get('timezone', '')
            })
            analysis['isp_info'].update({
                'isp': data.get('isp', ''),
                'organization': data.get('org', ''),
                'as_number': data.get('as', ''),
                'as_name': data.get('asname', '')
            })
            
            if data.get('proxy'):
                analysis['is_proxy'] = True
                proxy_indicators += 1
            if data.get('hosting'):
                analysis['is_hosting'] = True
                proxy_indicators += 0.5
        
        # Analyze VPN API results
        if 'vpnapi' in api_results:
            data = api_results['vpnapi']
            security = data.get('security', {})
            
            if security.get('vpn'):
                analysis['is_vpn'] = True
                proxy_indicators += 1
            if security.get('proxy'):
                analysis['is_proxy'] = True
                proxy_indicators += 1
            if security.get('tor'):
                analysis['is_tor'] = True
                proxy_indicators += 1.5
            if security.get('relay'):
                proxy_indicators += 0.5
        
        # Analyze ProxyCheck results
        if 'proxycheck' in api_results:
            data = api_results['proxycheck']
            
            if data.get('proxy') == 'yes':
                analysis['is_proxy'] = True
                proxy_indicators += 1
            
            # Check risk score
            risk = data.get('risk', 0)
            if risk > 50:
                analysis['threat_score'] = max(analysis['threat_score'], risk)
                proxy_indicators += (risk / 100)
        
        # Analyze IPInfo results
        if 'ipinfo' in api_results:
            data = api_results['ipinfo']
            
            # Check for hosting providers in org field
            org = data.get('org', '').lower()
            hosting_keywords = ['hosting', 'datacenter', 'cloud', 'server', 'digital ocean', 'aws', 'google cloud', 'azure']
            if any(keyword in org for keyword in hosting_keywords):
                analysis['is_hosting'] = True
                proxy_indicators += 0.3
        
        # Calculate final scores
        if total_sources > 0:
            analysis['confidence'] = min(100, (proxy_indicators / total_sources) * 100)
        
        # Determine risk level
        if proxy_indicators >= 2 or analysis['is_tor']:
            analysis['risk_level'] = 'critical'
            analysis['threat_score'] = max(analysis['threat_score'], 90)
        elif proxy_indicators >= 1.5 or (analysis['is_vpn'] and analysis['is_proxy']):
            analysis['risk_level'] = 'high'
            analysis['threat_score'] = max(analysis['threat_score'], 70)
        elif proxy_indicators >= 1 or analysis['is_vpn'] or analysis['is_proxy']:
            analysis['risk_level'] = 'medium'
            analysis['threat_score'] = max(analysis['threat_score'], 50)
        elif proxy_indicators >= 0.5 or analysis['is_hosting']:
            analysis['risk_level'] = 'low'
            analysis['threat_score'] = max(analysis['threat_score'], 30)
        
        return analysis
    
    def _update_scan_session(self, scan_session: ProxyScanSession, analysis: Dict[str, Any], api_results: Dict[str, Any]):
        """Update scan session with analysis results"""
        # Update detection flags
        scan_session.is_proxy = analysis['is_proxy']
        scan_session.is_vpn = analysis['is_vpn']
        scan_session.is_tor = analysis['is_tor']
        scan_session.is_hosting = analysis['is_hosting']
        scan_session.is_datacenter = analysis['is_datacenter']
        
        # Update location data
        location = analysis['location']
        scan_session.country = location.get('country', '')
        scan_session.region = location.get('region', '')
        scan_session.city = location.get('city', '')
        scan_session.latitude = location.get('latitude')
        scan_session.longitude = location.get('longitude')
        scan_session.timezone = location.get('timezone', '')
        
        # Update ISP info
        isp_info = analysis['isp_info']
        scan_session.isp = isp_info.get('isp', '')
        scan_session.organization = isp_info.get('organization', '')
        scan_session.as_number = isp_info.get('as_number', '')
        scan_session.as_name = isp_info.get('as_name', '')
        
        # Update threat assessment
        scan_session.threat_score = analysis['threat_score']
        scan_session.risk_level = analysis['risk_level']
        scan_session.is_malicious = analysis['threat_score'] >= 80
        scan_session.is_suspicious = analysis['threat_score'] >= 50
        
        # Store raw data
        scan_session.raw_response = api_results
        scan_session.api_sources = list(api_results.keys())
        
        scan_session.save()
    
    def _check_custom_rules(self, scan_session: ProxyScanSession):
        """Check custom proxy detection rules"""
        rules = ProxyDetectionRule.objects.filter(
            employer_id=scan_session.employer_id,
            is_active=True
        )
        
        for rule in rules:
            if self._rule_matches(rule, scan_session):
                # Create alert for custom rule match
                ProxyAlert.objects.create(
                    scan_session=scan_session,
                    alert_type='custom_rule',
                    severity='warning',
                    title=f'Custom Rule Triggered: {rule.name}',
                    description=f'IP {scan_session.ip_address} matches custom rule: {rule.description}',
                    recommendation='Review the connection and verify candidate identity.'
                )
                
                if rule.block_access:
                    scan_session.risk_level = 'critical'
                    scan_session.save()
    
    def _rule_matches(self, rule: ProxyDetectionRule, scan_session: ProxyScanSession) -> bool:
        """Check if a custom rule matches the scan session"""
        if rule.rule_type == 'country':
            return scan_session.country.upper() == rule.rule_value.upper()
        elif rule.rule_type == 'isp':
            return rule.rule_value.lower() in scan_session.isp.lower()
        elif rule.rule_type == 'asn':
            return rule.rule_value in scan_session.as_number
        elif rule.rule_type == 'ip_range':
            try:
                network = ipaddress.ip_network(rule.rule_value)
                ip = ipaddress.ip_address(scan_session.ip_address)
                return ip in network
            except ValueError:
                return False
        elif rule.rule_type == 'keyword':
            keywords = rule.rule_value.lower().split(',')
            search_text = f"{scan_session.isp} {scan_session.organization}".lower()
            return any(keyword.strip() in search_text for keyword in keywords)
        
        return False
    
    def _generate_alerts(self, scan_session: ProxyScanSession, analysis: Dict[str, Any]):
        """Generate alerts based on detection results"""
        alerts = []
        
        if analysis['is_tor']:
            alerts.append({
                'alert_type': 'tor_detected',
                'severity': 'critical',
                'title': 'Tor Network Detected',
                'description': 'The candidate is connecting through the Tor network, which provides anonymity and may indicate attempt to hide identity.',
                'recommendation': 'Immediately verify candidate identity through additional means. Consider requiring a different connection method.'
            })
        
        if analysis['is_proxy']:
            alerts.append({
                'alert_type': 'proxy_detected',
                'severity': 'critical' if analysis['risk_level'] == 'critical' else 'warning',
                'title': 'Proxy Server Detected',
                'description': 'The candidate appears to be connecting through a proxy server, which may hide their true location.',
                'recommendation': 'Verify candidate location and identity. Ask for explanation of proxy usage.'
            })
        
        if analysis['is_vpn']:
            alerts.append({
                'alert_type': 'vpn_detected',
                'severity': 'warning',
                'title': 'VPN Connection Detected',
                'description': 'The candidate is using a VPN connection, which may indicate location masking.',
                'recommendation': 'Confirm candidate location and ask about VPN usage reason.'
            })
        
        if analysis['threat_score'] >= 70:
            alerts.append({
                'alert_type': 'high_risk_ip',
                'severity': 'critical',
                'title': 'High Risk IP Address',
                'description': f'IP address has a high threat score of {analysis["threat_score"]}/100.',
                'recommendation': 'Exercise extreme caution. Verify candidate through multiple channels.'
            })
        
        # Create alert objects
        for alert_data in alerts:
            ProxyAlert.objects.create(
                scan_session=scan_session,
                **alert_data
            )
    
    def get_scan_statistics(self, employer_id: int, days: int = 30) -> Dict[str, Any]:
        """Get proxy scan statistics for employer"""
        from django.utils import timezone
        from datetime import timedelta
        
        start_date = timezone.now() - timedelta(days=days)
        
        scans = ProxyScanSession.objects.filter(
            employer_id=employer_id,
            started_at__gte=start_date
        )
        
        total_scans = scans.count()
        proxy_detected = scans.filter(is_proxy=True).count()
        vpn_detected = scans.filter(is_vpn=True).count()
        tor_detected = scans.filter(is_tor=True).count()
        high_risk = scans.filter(risk_level__in=['high', 'critical']).count()
        
        return {
            'total_scans': total_scans,
            'proxy_detected': proxy_detected,
            'vpn_detected': vpn_detected,
            'tor_detected': tor_detected,
            'high_risk_connections': high_risk,
            'clean_connections': total_scans - proxy_detected - vpn_detected,
            'detection_rate': (proxy_detected + vpn_detected) / total_scans * 100 if total_scans > 0 else 0
        }
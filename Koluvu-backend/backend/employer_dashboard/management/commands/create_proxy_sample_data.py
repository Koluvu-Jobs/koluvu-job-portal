# backend/employer_dashboard/management/commands/create_proxy_sample_data.py

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from employer_dashboard.models import (
    EmployerProfile, ProxyScanSession, ProxyDetectionRule, 
    ProxyAlert, Candidate
)
from django.utils import timezone
from datetime import timedelta
import random


class Command(BaseCommand):
    help = 'Create sample proxy detection data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating proxy detection sample data...')

        # Get or create test employer
        user, created = User.objects.get_or_create(
            username='employer_proxy_test',
            defaults={
                'email': 'proxy_test@company.com',
                'first_name': 'Proxy',
                'last_name': 'Tester'
            }
        )
        
        if created:
            user.set_password('test123')
            user.save()

        employer_profile, created = EmployerProfile.objects.get_or_create(
            user=user,
            defaults={
                'company_name': 'Proxy Security Corp',
                'phone': '+1-555-0123',
                'company_location': 'San Francisco, CA',
                'contact_person': 'John Security',
                'designation': 'Security Manager',
                'is_verified': True
            }
        )

        # Create sample candidates
        candidates_data = [
            {'name': 'Alice Johnson', 'email': 'alice@email.com', 'phone': '+1-555-0001'},
            {'name': 'Bob Smith', 'email': 'bob@email.com', 'phone': '+1-555-0002'},
            {'name': 'Charlie Brown', 'email': 'charlie@email.com', 'phone': '+1-555-0003'},
        ]

        candidates = []
        for candidate_data in candidates_data:
            candidate, created = Candidate.objects.get_or_create(
                email=candidate_data['email'],
                employer=employer_profile,
                defaults=candidate_data
            )
            candidates.append(candidate)

        # Create sample proxy detection rules
        rules_data = [
            {
                'name': 'Block Known VPN Providers',
                'description': 'Block connections from common VPN services',
                'rule_type': 'keyword',
                'rule_value': 'vpn,proxy,expressvpn,nordvpn,surfshark',
                'block_access': True
            },
            {
                'name': 'High Risk Countries',
                'description': 'Flag connections from high-risk countries',
                'rule_type': 'country',
                'rule_value': 'RU',
                'block_access': False
            },
            {
                'name': 'Data Center Networks',
                'description': 'Block data center IP ranges',
                'rule_type': 'keyword',
                'rule_value': 'amazon,google cloud,microsoft azure,digitalocean',
                'block_access': True
            }
        ]

        for rule_data in rules_data:
            ProxyDetectionRule.objects.get_or_create(
                name=rule_data['name'],
                employer=employer_profile,
                defaults=rule_data
            )

        # Create sample proxy scan sessions
        sample_ips = [
            {
                'ip': '8.8.8.8',
                'country': 'United States',
                'city': 'Mountain View',
                'isp': 'Google LLC',
                'is_proxy': False,
                'is_vpn': False,
                'risk_level': 'low',
                'threat_score': 10
            },
            {
                'ip': '198.51.100.1',
                'country': 'Netherlands',
                'city': 'Amsterdam',
                'isp': 'ExpressVPN',
                'is_proxy': True,
                'is_vpn': True,
                'risk_level': 'high',
                'threat_score': 85
            },
            {
                'ip': '203.0.113.5',
                'country': 'Singapore',
                'city': 'Singapore',
                'isp': 'DigitalOcean LLC',
                'is_proxy': False,
                'is_vpn': False,
                'is_hosting': True,
                'risk_level': 'medium',
                'threat_score': 45
            },
            {
                'ip': '192.0.2.10',
                'country': 'United Kingdom',
                'city': 'London',
                'isp': 'TorProject',
                'is_proxy': True,
                'is_tor': True,
                'risk_level': 'critical',
                'threat_score': 95
            },
            {
                'ip': '198.51.100.200',
                'country': 'Canada',
                'city': 'Toronto',
                'isp': 'Rogers Communications',
                'is_proxy': False,
                'is_vpn': False,
                'risk_level': 'low',
                'threat_score': 15
            }
        ]

        scans_created = 0
        for i, ip_data in enumerate(sample_ips):
            # Create scan session
            scan_session = ProxyScanSession.objects.create(
                employer=employer_profile,
                candidate=candidates[i % len(candidates)],
                ip_address=ip_data['ip'],
                scan_status='completed',
                risk_level=ip_data['risk_level'],
                is_proxy=ip_data.get('is_proxy', False),
                is_vpn=ip_data.get('is_vpn', False),
                is_tor=ip_data.get('is_tor', False),
                is_hosting=ip_data.get('is_hosting', False),
                country=ip_data['country'],
                city=ip_data['city'],
                isp=ip_data['isp'],
                threat_score=ip_data['threat_score'],
                is_malicious=ip_data['threat_score'] >= 80,
                is_suspicious=ip_data['threat_score'] >= 50,
                started_at=timezone.now() - timedelta(days=random.randint(0, 30)),
                completed_at=timezone.now() - timedelta(days=random.randint(0, 30))
            )
            scans_created += 1

            # Create alerts for high-risk scans
            if ip_data['threat_score'] >= 70:
                alerts = []
                
                if ip_data.get('is_tor'):
                    alerts.append({
                        'alert_type': 'tor_detected',
                        'severity': 'critical',
                        'title': 'Tor Network Detected',
                        'description': f'Connection from {ip_data["ip"]} is using Tor network.',
                        'recommendation': 'Immediately verify candidate identity through alternative means.'
                    })
                
                if ip_data.get('is_vpn'):
                    alerts.append({
                        'alert_type': 'vpn_detected',
                        'severity': 'warning',
                        'title': 'VPN Connection Detected',
                        'description': f'Connection from {ip_data["ip"]} appears to be using a VPN service.',
                        'recommendation': 'Ask candidate about VPN usage and verify their location.'
                    })
                
                if ip_data.get('is_proxy'):
                    alerts.append({
                        'alert_type': 'proxy_detected',
                        'severity': 'critical',
                        'title': 'Proxy Server Detected',
                        'description': f'Connection from {ip_data["ip"]} is routing through a proxy server.',
                        'recommendation': 'Verify candidate identity and require direct connection.'
                    })

                for alert_data in alerts:
                    ProxyAlert.objects.create(
                        scan_session=scan_session,
                        **alert_data
                    )

        # Create some additional historical data
        for _ in range(15):
            days_ago = random.randint(1, 90)
            scan_date = timezone.now() - timedelta(days=days_ago)
            
            # Generate random scan data
            is_suspicious = random.choice([True, False, False, False])  # 25% suspicious
            
            if is_suspicious:
                risk_level = random.choice(['medium', 'high', 'critical'])
                threat_score = random.randint(50, 95)
                is_proxy = random.choice([True, False])
                is_vpn = random.choice([True, False])
            else:
                risk_level = 'low'
                threat_score = random.randint(0, 30)
                is_proxy = False
                is_vpn = False

            scan_session = ProxyScanSession.objects.create(
                employer=employer_profile,
                candidate=random.choice(candidates),
                ip_address=f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}",
                scan_status='completed',
                risk_level=risk_level,
                is_proxy=is_proxy,
                is_vpn=is_vpn,
                country=random.choice(['United States', 'Canada', 'United Kingdom', 'Germany', 'France']),
                city=random.choice(['New York', 'London', 'Toronto', 'Berlin', 'Paris']),
                isp=random.choice(['Comcast', 'Verizon', 'AT&T', 'BT Group', 'Deutsche Telekom']),
                threat_score=threat_score,
                is_malicious=threat_score >= 80,
                is_suspicious=threat_score >= 50,
                started_at=scan_date,
                completed_at=scan_date + timedelta(seconds=random.randint(2, 10))
            )
            scans_created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Sample proxy detection data created successfully!\n'
                f'📊 Created:\n'
                f'   - Employer: {employer_profile.company_name}\n'
                f'   - Candidates: {len(candidates)}\n'
                f'   - Detection Rules: {len(rules_data)}\n'
                f'   - Proxy Scans: {scans_created}\n'
                f'   - Sample Alerts: Multiple security alerts\n\n'
                f'🔐 Login Credentials:\n'
                f'   - Username: employer_proxy_test\n'
                f'   - Password: test123\n\n'
                f'🌐 Test the system at: http://localhost:3000/dashboard/employer?tab=proxying-detector'
            )
        )
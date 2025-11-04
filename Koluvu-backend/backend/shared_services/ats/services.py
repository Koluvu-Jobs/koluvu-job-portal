import re
import json
from typing import Dict, List, Any
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class ATSAnalyzerService:
    """Service class for ATS document analysis"""
    
    def __init__(self):
        self.common_keywords = [
            'python', 'javascript', 'react', 'django', 'sql', 'aws', 'docker',
            'kubernetes', 'git', 'agile', 'scrum', 'api', 'rest', 'microservices',
            'machine learning', 'data analysis', 'project management', 'leadership',
            'communication', 'teamwork', 'problem solving', 'analytical thinking'
        ]
    
    def analyze_document(self, document_text: str, analysis_type: str, user_profile=None) -> Dict[str, Any]:
        """
        Analyze document for ATS compatibility
        
        Args:
            document_text: The document content to analyze
            analysis_type: Type of analysis (RESUME, JOB_DESCRIPTION, etc.)
            user_profile: User's ATS profile for personalization
            
        Returns:
            Dictionary containing analysis results
        """
        try:
            # Clean and prepare text
            cleaned_text = self._clean_text(document_text)
            
            # Find keywords
            keywords_found = self._extract_keywords(cleaned_text)
            keywords_missing = self._identify_missing_keywords(keywords_found, analysis_type)
            
            # Calculate ATS score
            score = self._calculate_ats_score(cleaned_text, keywords_found, analysis_type)
            
            # Generate feedback
            feedback = self._generate_feedback(score, keywords_found, keywords_missing, analysis_type)
            
            # Generate suggestions
            suggestions = self._generate_suggestions(score, keywords_found, keywords_missing, analysis_type)
            
            return {
                'score': round(score, 2),
                'keywords_found': keywords_found,
                'keywords_missing': keywords_missing,
                'feedback': feedback,
                'suggestions': suggestions
            }
            
        except Exception as e:
            logger.error(f"Error in ATS analysis: {str(e)}")
            return {
                'score': 0,
                'keywords_found': [],
                'keywords_missing': [],
                'feedback': {'error': 'Analysis failed'},
                'suggestions': ['Please try again or contact support']
            }
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text for analysis"""
        if not text:
            return ""
        
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Convert to lowercase for analysis
        return text.lower()
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract relevant keywords from text"""
        found_keywords = []
        
        for keyword in self.common_keywords:
            if keyword.lower() in text:
                found_keywords.append(keyword)
        
        # Additional keyword extraction logic could be added here
        # (e.g., NLP, industry-specific terms, etc.)
        
        return found_keywords
    
    def _identify_missing_keywords(self, found_keywords: List[str], analysis_type: str) -> List[str]:
        """Identify important missing keywords based on analysis type"""
        if analysis_type == 'RESUME':
            important_keywords = [
                'experience', 'skills', 'education', 'achievements',
                'projects', 'certifications', 'leadership', 'teamwork'
            ]
        elif analysis_type == 'JOB_DESCRIPTION':
            important_keywords = [
                'requirements', 'qualifications', 'responsibilities',
                'experience', 'skills', 'benefits', 'company culture'
            ]
        else:
            important_keywords = ['experience', 'skills', 'qualifications']
        
        missing = []
        for keyword in important_keywords:
            if keyword not in found_keywords:
                missing.append(keyword)
        
        return missing[:5]  # Return top 5 missing keywords
    
    def _calculate_ats_score(self, text: str, keywords_found: List[str], analysis_type: str) -> float:
        """Calculate ATS compatibility score"""
        base_score = 50.0  # Base score
        
        # Keyword density score (40% of total)
        keyword_score = len(keywords_found) * 2
        keyword_score = min(keyword_score, 40)  # Cap at 40
        
        # Text length score (10% of total)
        text_length = len(text.split())
        if analysis_type == 'RESUME':
            optimal_length = 400  # ~400 words for resume
        elif analysis_type == 'JOB_DESCRIPTION':
            optimal_length = 300  # ~300 words for job description
        else:
            optimal_length = 250
        
        length_score = 10 - abs(text_length - optimal_length) / optimal_length * 10
        length_score = max(0, length_score)  # Don't go below 0
        
        # Format and structure score (placeholder - would need more sophisticated analysis)
        structure_score = 0
        if any(word in text for word in ['experience', 'education', 'skills']):
            structure_score += 5
        if any(word in text for word in ['•', '-', '*']):  # Bullet points
            structure_score += 3
        
        total_score = base_score + keyword_score + length_score + structure_score
        
        return min(total_score, 100.0)  # Cap at 100
    
    def _generate_feedback(self, score: float, keywords_found: List[str], 
                          keywords_missing: List[str], analysis_type: str) -> Dict[str, Any]:
        """Generate detailed feedback based on analysis"""
        feedback = {
            'overall_rating': self._get_rating_from_score(score),
            'keyword_analysis': {
                'found_count': len(keywords_found),
                'found_keywords': keywords_found,
                'missing_count': len(keywords_missing),
                'missing_keywords': keywords_missing
            },
            'areas_for_improvement': []
        }
        
        if score < 60:
            feedback['areas_for_improvement'].extend([
                'Increase relevant keyword density',
                'Add more industry-specific terms',
                'Improve document structure'
            ])
        elif score < 80:
            feedback['areas_for_improvement'].extend([
                'Fine-tune keyword optimization',
                'Add more quantifiable achievements'
            ])
        else:
            feedback['areas_for_improvement'].append('Document is well-optimized!')
        
        return feedback
    
    def _generate_suggestions(self, score: float, keywords_found: List[str],
                            keywords_missing: List[str], analysis_type: str) -> List[str]:
        """Generate actionable suggestions for improvement"""
        suggestions = []
        
        if len(keywords_missing) > 0:
            suggestions.append(f"Consider adding these keywords: {', '.join(keywords_missing[:3])}")
        
        if score < 70:
            if analysis_type == 'RESUME':
                suggestions.extend([
                    "Use bullet points to highlight achievements",
                    "Include quantifiable results (numbers, percentages)",
                    "Add relevant certifications or training",
                    "Tailor keywords to match job descriptions"
                ])
            elif analysis_type == 'JOB_DESCRIPTION':
                suggestions.extend([
                    "Clearly list required qualifications",
                    "Include specific technical skills needed",
                    "Mention company benefits and culture",
                    "Use industry-standard terminology"
                ])
        
        if score >= 80:
            suggestions.append("Great job! Your document is well-optimized for ATS systems.")
        
        return suggestions
    
    def _get_rating_from_score(self, score: float) -> str:
        """Convert numeric score to rating"""
        if score >= 90:
            return 'Excellent'
        elif score >= 80:
            return 'Very Good'
        elif score >= 70:
            return 'Good'
        elif score >= 60:
            return 'Fair'
        else:
            return 'Needs Improvement'
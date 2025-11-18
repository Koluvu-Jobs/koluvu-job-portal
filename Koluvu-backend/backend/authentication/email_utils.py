import base64
import os
from django.conf import settings

def get_svg_logo():
    """Create a small SVG version of the Koluvu logo for emails"""
    svg_logo = '''<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <circle cx="30" cy="30" r="28" fill="white" stroke="#ff8c42" stroke-width="2"/>
  <circle cx="30" cy="30" r="24" fill="none" stroke="#4CAF50" stroke-width="1"/>
  
  <!-- Three dots -->
  <circle cx="22" cy="18" r="2" fill="#4CAF50"/>
  <circle cx="30" cy="18" r="2" fill="#2196F3"/>
  <circle cx="38" cy="18" r="2" fill="#ff8c42"/>
  
  <!-- Orange curved element -->
  <path d="M 18 25 Q 25 32 18 42 Q 28 35 35 42 Q 30 30 18 25" fill="#ff8c42"/>
  
  <!-- Green arrow/chevron -->
  <path d="M 35 28 L 42 35 L 35 42 L 38 42 L 45 35 L 38 28 Z" fill="#4CAF50"/>
</svg>'''
    
    # Encode SVG as base64
    encoded = base64.b64encode(svg_logo.encode('utf-8')).decode('utf-8')
    return f"data:image/svg+xml;base64,{encoded}"

def get_html_logo():
    """Create an HTML-based logo using CSS when images fail completely"""
    return '''<div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #ff8c42 0%, #4CAF50 50%, #2196F3 100%); display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.2); border: 3px solid white;">
        <span style="color: white; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif;">K</span>
    </div>'''

def get_logo_base64():
    """Get the Koluvu logo as base64 encoded string for email embedding"""
    try:
        # Use the 80KB logo file for email embedding
        logo_path = os.path.join(
            settings.BASE_DIR.parent.parent, 
            'koluvu-frontend', 
            'public', 
            'images', 
            'koluvu_logo-80kb.jpg'
        )
        
        # Alternative path if the above doesn't work
        if not os.path.exists(logo_path):
            logo_path = os.path.join(
                settings.BASE_DIR.parent, 
                'koluvu-frontend', 
                'public', 
                'images', 
                'koluvu_logo-80kb.jpg'
            )
        
        # Check if file exists
        if os.path.exists(logo_path):
            with open(logo_path, 'rb') as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                return f"data:image/jpeg;base64,{encoded_string}"
        else:
            # Return None if logo file is not found
            return None
            
    except Exception as e:
        print(f"Error encoding logo: {str(e)}")
        return None

def get_logo_url():
    """Get the logo URL - use optimized SVG for reliable email display"""
    # Try SVG logo first (very small, reliable)
    try:
        svg_logo = get_svg_logo()
        return svg_logo
    except Exception as e:
        print(f"SVG logo failed: {e}")
        
        # Fallback to base64 encoded image
        base64_logo = get_logo_base64()
        if base64_logo:
            return base64_logo
        else:
            # Final fallback to external URL
            return f"{settings.FRONTEND_URL}/images/koluvu_logo-80kb.jpg"
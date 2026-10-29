# Open Graph Image - PLACEHOLDER

## Required: Create og-image.jpg

**Location**: Place image at `public/og-image.jpg`

**Specifications**:
- Recommended size: 1200x630 pixels (Facebook/LinkedIn optimal)
- Format: JPG or PNG
- Max file size: < 1MB (preferably < 500KB)
- Aspect ratio: 1.91:1

**Content Suggestions**:
1. Your professional photo
2. Your name: "Pamuda U. de A. Goonatilake"
3. Title: "Full Stack Developer & Cloud Enthusiast"
4. Key positions:
   - AWS Cloud Club Captain
   - Program Team Lead - IEEE
5. Brand color: #ff7300 (Orange)
6. University of Jaffna logo (if permitted)

**Design Tools**:
- Canva: https://www.canva.com/templates/EAE4B1Qvd7E-orange-modern-professional-linkedin-banner/
- Figma: Free design tool
- Adobe Spark: Easy online tool
- Or hire on Fiverr for $5-10

**Testing**:
After creating, test with:
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

**Current Status**: ⚠️ MISSING - Using placeholder URL in SEO component

Once created, update the image path in:
- `src/components/SEO.tsx` (line 13): `image = "/og-image.jpg"`

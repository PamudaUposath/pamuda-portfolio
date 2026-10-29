# Portfolio Images

Place your images in this folder:

## Required Images:

1. **profile.jpg** - Your profile photo (recommended: 400x400px or larger, square aspect ratio)
   - This will be displayed in the Hero section with an orange background shape

2. **Project Screenshots** (in `projects/` subfolder):
   - Add screenshots for each project listed in `src/data/projects.ts`
   - Recommended size: 800x600px or 16:9 aspect ratio
   - Format: JPG or PNG
   - Name them according to what you specify in the `image` field in projects.ts

## Example structure:
```
public/
├── profile.jpg              # Your profile photo
├── cv.pdf                   # Your CV/Resume (optional)
└── projects/                # Project screenshots
    ├── wildlife-app.jpg
    ├── cloud-dashboard.jpg
    ├── weather-station.jpg
    └── ...
```

## Tips:
- Use optimized images (compressed) for faster loading
- Maintain consistent image quality across all projects
- Use descriptive filenames
- Consider using a fallback/placeholder image generator if you don't have images yet

The portfolio will show placeholder images from via.placeholder.com if the actual images are not found, so you can test the layout before adding real images.

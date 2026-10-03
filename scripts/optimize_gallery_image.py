#!/usr/bin/env python3
"""
Optimize gallery images:
- Auto-corrects EXIF orientation.
- Converts non-RGB / alpha channels cleanly if saving as JPEG.
- Resizes main image proportionally to fit within 1920x1920 (quality=85).
- Generates thumbnail proportionally to fit within 600x600 (quality=80).
- Emits JSON status report on stdout.
"""

import sys
import os
import json
import argparse
from PIL import Image, ImageOps

try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except Exception:
    pass

# Ensure Resampling filter compatibility across Pillow versions
RESAMPLE_FILTER = getattr(Image, 'Resampling', Image).LANCZOS

def convert_to_rgb_if_needed(image, target_path):
    """
    Ensure image can be safely saved to JPEG/RGB format without alpha transparency issues.
    """
    ext = os.path.splitext(target_path)[1].lower()
    if ext in ('.jpg', '.jpeg'):
        if image.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[-1])
            return background
        elif image.mode == 'P':
            rgba_image = image.convert('RGBA')
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(rgba_image, mask=rgba_image.split()[-1])
            return background
        elif image.mode != 'RGB':
            return image.convert('RGB')
    return image

def save_image(image, output_path, quality, max_dim=None):
    """
    Resize proportionally if exceeding max_dim and save with given quality.
    """
    im = image.copy()
    if max_dim and (im.width > max_dim or im.height > max_dim):
        im.thumbnail((max_dim, max_dim), RESAMPLE_FILTER)

    im = convert_to_rgb_if_needed(im, output_path)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    ext = os.path.splitext(output_path)[1].lower()

    save_kwargs = {'optimize': True}
    if ext in ('.jpg', '.jpeg', '.webp'):
        save_kwargs['quality'] = quality

    im.save(output_path, **save_kwargs)
    return im.size

def parse_arguments():
    parser = argparse.ArgumentParser(description="Optimize gallery images and generate thumbnails.")
    parser.add_argument('-i', '--input', dest='input_path', help="Path to input image file")
    parser.add_argument('-o', '--output', dest='output_path', help="Path to output optimized image file")
    parser.add_argument('-t', '--thumbnail', dest='thumbnail_path', help="Path to output thumbnail image file")
    parser.add_argument('positional_args', nargs='*', help="Positional arguments [input] [output] [thumbnail]")

    args = parser.parse_args()

    input_path = args.input_path
    output_path = args.output_path
    thumbnail_path = args.thumbnail_path

    # Fallback to positional arguments if flags were not provided
    if not input_path and len(args.positional_args) > 0:
        input_path = args.positional_args[0]
    if not output_path and len(args.positional_args) > 1:
        output_path = args.positional_args[1]
    if not thumbnail_path and len(args.positional_args) > 2:
        thumbnail_path = args.positional_args[2]

    if not input_path:
        parser.error("Input path must be specified via --input or positional argument.")

    if not output_path:
        output_path = input_path

    return input_path, output_path, thumbnail_path

def main():
    try:
        input_path, output_path, thumbnail_path = parse_arguments()

        if not os.path.exists(input_path):
            result = {
                "success": False,
                "error": f"Input file does not exist: {input_path}"
            }
            print(json.dumps(result))
            sys.exit(1)

        with Image.open(input_path) as orig_img:
            # Handle EXIF orientation
            transposed_img = ImageOps.exif_transpose(orig_img)
            orig_size = transposed_img.size

            # Save optimized main image (max 1920px, quality=85)
            main_size = save_image(transposed_img, output_path, quality=85, max_dim=1920)

            thumb_size = None
            if thumbnail_path:
                # Save thumbnail image (max 600px, quality=80)
                thumb_size = save_image(transposed_img, thumbnail_path, quality=80, max_dim=600)

        result = {
            "success": True,
            "input": os.path.abspath(input_path),
            "output": os.path.abspath(output_path),
            "thumbnail": os.path.abspath(thumbnail_path) if thumbnail_path else None,
            "original_size": {"width": orig_size[0], "height": orig_size[1]},
            "main_size": {"width": main_size[0], "height": main_size[1]},
            "thumbnail_size": {"width": thumb_size[0], "height": thumb_size[1]} if thumb_size else None
        }
        print(json.dumps(result))
        sys.exit(0)

    except Exception as e:
        result = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(result))
        sys.exit(1)

if __name__ == '__main__':
    main()

"""Encode the original fonts as lossless WOFF2, preserving glyphs and font layout."""
from pathlib import Path
from fontTools.ttLib import TTFont

for source in Path('public/fonts').glob('*.ttf'):
    font = TTFont(source)
    font.flavor = 'woff2'
    target = source.with_suffix('.woff2')
    font.save(target)
    print(f'{target}: {target.stat().st_size} bytes')

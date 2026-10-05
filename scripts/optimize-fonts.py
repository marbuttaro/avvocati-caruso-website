"""Regenerate Latin WOFF2 assets: python3 -m pip install 'fonttools[woff]'"""
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

for source in Path('public/fonts').glob('*.ttf'):
    font = TTFont(source)
    # The site uses normal width; preserve the variable weight axis.
    if 'fvar' in font and any(axis.axisTag == 'wdth' for axis in font['fvar'].axes):
        font = instantiateVariableFont(font, {'wdth': 100}, inplace=True)
    options = subset.Options()
    options.flavor = 'woff2'
    selector = subset.Subsetter(options=options)
    selector.populate(unicodes=subset.parse_unicodes(
        'U+0000-024F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2190-21FF,U+FEFF,U+FFFD'
    ))
    selector.subset(font)
    font.flavor = 'woff2'
    target = source.with_suffix('.woff2')
    font.save(target)
    print(f'{target}: {target.stat().st_size} bytes')

#!/bin/bash

echo 'cleanup old files'
rm -f *.min.js 2> /dev/null
rm -f *.min.js.jgz 2> /dev/null


version=1.0.3

echo 'build js'
java -jar ./node_modules/closurecompiler/compiler/closure-compiler-v20161201.jar \
	--compilation_level SIMPLE_OPTIMIZATIONS \
	--js ./lib/Astro.js \
	--js ./lib/Astro.Coord.js \
	--js ./lib/Astro.DeltaT.js \
	--js ./lib/Astro.Globe.js \
	--js ./lib/Astro.Interp.js \
	--js ./lib/Astro.JulianDay.js \
	--js ./lib/Astro.Math.js \
	--js ./lib/Astro.Moon.js \
	--js ./lib/Astro.MoonIllum.js \
	--js ./lib/Astro.Nutation.js \
	--js ./lib/Astro.Parallax.js \
	--js ./lib/Astro.Refraction.js \
	--js ./lib/Astro.Rise.js \
	--js ./lib/Astro.Sidereal.js \
	--js ./lib/Astro.Solar.js \
	--js ./lib/Astro.Solistice.js \
	--js_output_file meuusjs.${version}.min.js


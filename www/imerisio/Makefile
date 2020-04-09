PANDORA_DIR = ../../mnt/pandora
PANDORA_WWW = ../mnt/pandora

BUNDLEJS = bundle.js
BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

$(BUNDLEJS): \
	$(PANDORA_DIR)/lib/pandoraCore.js \
	$(PANDORA_WWW)/lib/pandora.js \
	main.js \
	../lib/letrak.js \
	../../lib/letrakCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js



.PHONY: migration_run migration_revert

db_run:
	node ./node_modules/typeorm/cli.js -d dist/ormConfig.js migration:run

db_revert:
	node ./node_modules/typeorm/cli.js -d dist/ormConfig.js migration:revert
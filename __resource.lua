resource_manifest_version '44febabe-d386-4d18-afbe-5e627f4af937'

client_scripts {
	'@es_extended/locale.lua',
	'config.lua',
	'client/main.lua'
}

server_scripts {
	'@mysql-async/lib/MySQL.lua',
	'@es_extended/locale.lua',
	'config.lua',
	'server/main.lua'
}

ui_page 'html/ui.html'

files {
	"html/*",
	'html/img/items/*',
	"html/fonts/*",
	"html/js/*",
	"html/css/*"
}

dependencies {
	'mysql-async',
	'es_extended'
}

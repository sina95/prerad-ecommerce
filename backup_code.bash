folder_name=backup/code/$(date "+%d%m%Y%H%M")
mkdir -p $folder_name
for file in $(ls | grep -E -v '^(db\.sqlite3|backup|build|logs|media|node_modules|static|venv)$'); do
    cp -r "$file" $folder_name;
done


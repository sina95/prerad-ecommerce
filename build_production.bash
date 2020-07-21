# 1. Build the frontend
npm i
npm run build

# 2. Move files at the build root inside a root subdirectory
mkdir -p build/root
for file in $(ls build | grep -E -v '^(index\.html|static|root)$'); do
    mv "build/$file" build/root;
done

source venv/bin/activate
# 3. Build the backend/collect static
python manage.py collectstatic --no-input


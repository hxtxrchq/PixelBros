# PixelBros

Sitio web oficial de PixelBros. Enfocado en branding, marketing y portafolio con un flujo claro de contacto y postulaciones.

## Lo que incluye
- Home, servicios, portafolio y contacto.
- Formulario de postulacion con envio a email.
- Animaciones ligeras con Framer Motion.

## Stack
- React + Vite
- Tailwind CSS
- Framer Motion
- React Router

## Scripts
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Configuracion rapida
- Copia `.env.example` a `.env` y define `VITE_API_URL=https://backendpixel.chiqo.site/api/v1` en produccion.
- Formulario de contacto: endpoint en [src/pages/Contact.jsx](src/pages/Contact.jsx).
- Formulario de postulacion: endpoint en [src/pages/Apply.jsx](src/pages/Apply.jsx).
- Assets: [src/assets](src/assets).

## Notas
- Los links de CV/portafolio deben ser publicos.
- Cambia el contenido desde los componentes en [src/components](src/components) y paginas en [src/pages](src/pages).

## Despliegue en Droplet

1. Clona el repo:
```bash
cd /home/user/pixelbros
git clone <frontend-repo-url> frontend
cd frontend
```

2. Instala dependencias:
```bash
npm install
```

3. Crea `.env` con la URL del backend:
```bash
cp .env.example .env
echo 'VITE_API_URL=https://backendpixel.chiqo.site/api/v1' >> .env
```

4. Compila para producción:
```bash
npm run build
```

La carpeta `dist/` está lista para servir con nginx.

5. Configura nginx:
```nginx
server {
    listen 80;
    server_name pixelbros.pe www.pixelbros.pe;

    root /home/user/pixelbros/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

O despliega en Vercel linkando el repo con `VITE_API_URL` en variables de entorno.

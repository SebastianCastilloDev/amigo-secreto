# 🎁 Amigo Secreto

App sencilla para organizar el intercambio de regalos navideños en familia.

## ¿Qué hace?

- **Agregar participantes** - Añadir nombres de familiares desde `/admin`
- **Generar invitaciones** - Cada participante recibe un link único y privado
- **Tómbola interactiva** - Cada persona saca su propio papelito de la tómbola
- **Ver asignación** - Cada persona solo puede ver a quién le toca regalar

## Cómo funciona

1. El organizador entra a `/admin` y agrega los participantes
2. Hace clic en "📋 Copiar invitación" para cada persona
3. Envía el link único a cada familiar (por WhatsApp, email, etc.)
4. Cada familiar entra con su link y saca su papelito de la tómbola
5. ¡Nadie sabe a quién le toca regalarle cada quién! 🎁

## Tecnologías

| Componente | Tecnología |
|------------|------------|
| Frontend + Backend | Next.js |
| Base de datos | Prisma Postgres (cloud) |
| ORM | Prisma |

## Configuración

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Crear archivo `.env` con tu `DATABASE_URL`
4. Generar cliente Prisma: `npx prisma generate`
5. Sincronizar base de datos: `npx prisma db push`
6. Iniciar: `npm run dev`

## Variables de entorno

```env
DATABASE_URL="prisma+postgres://..."
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal (redirige a admin si no hay token) |
| `/admin` | Panel de administración (agregar participantes, copiar invitaciones) |
| `/participar/[token]` | Página única de cada participante para sacar su papelito |

---

Hecho con ❤️ para la familia 🎄

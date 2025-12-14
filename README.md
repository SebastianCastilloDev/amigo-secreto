# 🎁 Amigo Secreto

App sencilla para organizar el intercambio de regalos navideños en familia.

## ¿Qué hace?

- **Agregar participantes** - Añadir nombres de familiares
- **Hacer el sorteo** - Asignar aleatoriamente quién le regala a quién
- **Ver asignación** - Cada persona puede ver a quién le toca regalar (sin revelar a los demás)

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
5. Ejecutar migraciones: `npx prisma migrate dev`
6. Iniciar: `npm run dev`

## Variables de entorno

```env
DATABASE_URL="prisma+postgres://..."
```

---

Hecho con ❤️ para la familia 🎄

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "tipo" TEXT,
    "descripcion" TEXT,
    "imagenPrincipal" TEXT,
    "imagenes" JSONB,
    "logoCliente" TEXT,
    "ciudad" TEXT,
    "cantidadUnidades" INTEGER,
    "productosUsados" JSONB,
    "testimonio" TEXT,
    "nombreTestimonio" TEXT,
    "cargoTestimonio" TEXT,
    "estrellasTestimonio" INTEGER,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "estado" TEXT NOT NULL DEFAULT 'PUBLICADO',
    "fecha" DATETIME,
    "horaInicio" TEXT,
    "horaFin" TEXT,
    "ubicacion" TEXT,
    "tipoEvento" TEXT,
    "numeroInvitados" INTEGER,
    "clienteId" TEXT,
    "contactoNombre" TEXT,
    "contactoTelefono" TEXT,
    "contactoEmail" TEXT,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Evento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Evento" ("anio", "cantidadUnidades", "cargoTestimonio", "ciudad", "createdAt", "descripcion", "destacado", "estado", "estrellasTestimonio", "id", "imagenPrincipal", "imagenes", "logoCliente", "nombre", "nombreTestimonio", "productosUsados", "slug", "testimonio", "tipo", "updatedAt") SELECT "anio", "cantidadUnidades", "cargoTestimonio", "ciudad", "createdAt", "descripcion", "destacado", "estado", "estrellasTestimonio", "id", "imagenPrincipal", "imagenes", "logoCliente", "nombre", "nombreTestimonio", "productosUsados", "slug", "testimonio", "tipo", "updatedAt" FROM "Evento";
DROP TABLE "Evento";
ALTER TABLE "new_Evento" RENAME TO "Evento";
CREATE UNIQUE INDEX "Evento_slug_key" ON "Evento"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

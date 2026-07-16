-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "icono" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nombreCorto" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "descripcionCorta" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "badge" TEXT,
    "imagenPrincipal" TEXT NOT NULL,
    "imagenes" JSONB,
    "especificaciones" JSONB,
    "precioBase" DECIMAL,
    "unidadMedida" TEXT NOT NULL DEFAULT 'unidad',
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombreEmpresa" TEXT NOT NULL,
    "nombreContacto" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "sector" TEXT,
    "ciudad" TEXT,
    "direccion" TEXT,
    "notas" TEXT,
    "fuente" TEXT NOT NULL DEFAULT 'WEB',
    "estado" TEXT NOT NULL DEFAULT 'PROSPECTO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cotizacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
    "fechaEvento" DATETIME,
    "ubicacionEvento" TEXT,
    "tipoEvento" TEXT,
    "duracionDias" INTEGER,
    "costoTotal" DECIMAL,
    "precioVenta" DECIMAL,
    "margen" DECIMAL,
    "moneda" TEXT NOT NULL DEFAULT 'COP',
    "creadoPorId" TEXT NOT NULL,
    "notasInternas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cotizacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cotizacion_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CotizacionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cotizacionId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL NOT NULL,
    "precioTotal" DECIMAL NOT NULL,
    "descripcionPersonalizada" TEXT,
    "costoUnitario" DECIMAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CotizacionItem_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "Cotizacion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CotizacionItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evento" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'EDITOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcceso" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "nombreSitio" TEXT NOT NULL DEFAULT 'Junisama Inversiones S.A.S',
    "telefono" TEXT NOT NULL DEFAULT '+57 350 708 9584',
    "email" TEXT NOT NULL DEFAULT 'soporte@junisama.com',
    "direccionMedellin" TEXT NOT NULL DEFAULT 'Calle 13 sur #51C-54',
    "direccionBogota" TEXT NOT NULL DEFAULT 'Cra 58b bis # 131A 51',
    "whatsappNumero" TEXT NOT NULL DEFAULT '573507089584',
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "seoTitleDefault" TEXT,
    "seoDescriptionDefault" TEXT,
    "scriptAnalytics" TEXT,
    "mensajeWhatsApp" TEXT NOT NULL DEFAULT 'Hola, me gustaría recibir información sobre sus servicios.',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pregunta" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'GENERAL',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'PUBLICADO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_slug_key" ON "Producto"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Cotizacion_codigo_key" ON "Cotizacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Evento_slug_key" ON "Evento"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

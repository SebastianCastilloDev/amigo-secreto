-- CreateTable
CREATE TABLE "Participante" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asignacion" (
    "id" SERIAL NOT NULL,
    "quienRegalaId" INTEGER NOT NULL,
    "quienRecibeId" INTEGER NOT NULL,

    CONSTRAINT "Asignacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asignacion_quienRegalaId_key" ON "Asignacion"("quienRegalaId");

-- CreateIndex
CREATE UNIQUE INDEX "Asignacion_quienRecibeId_key" ON "Asignacion"("quienRecibeId");

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_quienRegalaId_fkey" FOREIGN KEY ("quienRegalaId") REFERENCES "Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_quienRecibeId_fkey" FOREIGN KEY ("quienRecibeId") REFERENCES "Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `TicketService` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TicketService" DROP CONSTRAINT "TicketService_addedById_fkey";

-- DropForeignKey
ALTER TABLE "TicketService" DROP CONSTRAINT "TicketService_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "TicketService" DROP CONSTRAINT "TicketService_ticketId_fkey";

-- DropTable
DROP TABLE "TicketService";

-- CreateTable
CREATE TABLE "ticket_service" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ticket_service" ADD CONSTRAINT "ticket_service_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_service" ADD CONSTRAINT "ticket_service_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_service" ADD CONSTRAINT "ticket_service_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

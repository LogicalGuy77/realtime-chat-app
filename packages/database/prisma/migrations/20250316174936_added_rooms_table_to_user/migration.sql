-- CreateTable
CREATE TABLE "_RoomsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoomsToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RoomsToUser_B_index" ON "_RoomsToUser"("B");

-- AddForeignKey
ALTER TABLE "_RoomsToUser" ADD CONSTRAINT "_RoomsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomsToUser" ADD CONSTRAINT "_RoomsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

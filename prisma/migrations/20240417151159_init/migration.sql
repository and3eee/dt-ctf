-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `refresh_token_expires_in` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bucket` ENUM('AGENT', 'ENV', 'DEM', 'NONE') NULL DEFAULT 'NONE',
    `skillLevel` INTEGER NULL DEFAULT 5,
    `eventId` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'USER', 'ORGANIZER', 'FLAGMASTER') NOT NULL DEFAULT 'USER',
    `teamEntryId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Riddle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `riddle` VARCHAR(191) NOT NULL,
    `difficulty` VARCHAR(191) NULL,
    `bucket` VARCHAR(191) NULL,
    `topic` VARCHAR(191) NULL,
    `author` VARCHAR(191) NULL,
    `implemented` BOOLEAN NOT NULL DEFAULT false,
    `validated` BOOLEAN NOT NULL DEFAULT false,
    `solution` VARCHAR(191) NOT NULL,
    `sourceLocation` VARCHAR(191) NULL,
    `sourceDescription` VARCHAR(191) NULL,
    `sourceURL` VARCHAR(191) NULL,
    `sourcePlaceHolder` VARCHAR(191) NULL,
    `eventId` VARCHAR(191) NULL,

    UNIQUE INDEX `Riddle_id_key`(`id`),
    UNIQUE INDEX `Riddle_riddle_key`(`riddle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `prize` VARCHAR(191) NULL,
    `requireURL` BOOLEAN NULL DEFAULT false,
    `requireScreenshot` BOOLEAN NULL DEFAULT false,
    `active` BOOLEAN NULL DEFAULT false,
    `useAssignedTeams` BOOLEAN NULL DEFAULT true,
    `showParticipants` BOOLEAN NULL DEFAULT false,
    `showTeams` BOOLEAN NULL DEFAULT false,
    `useTeams` BOOLEAN NULL DEFAULT false,
    `teamSize` INTEGER NOT NULL DEFAULT 3,
    `public` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Event_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeamEntry` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TeamEntry_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserEntry` (
    `id` VARCHAR(191) NOT NULL,
    `answeredAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `riddleId` INTEGER NOT NULL,
    `teamEntryId` VARCHAR(191) NULL,

    UNIQUE INDEX `UserEntry_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_teamEntryId_fkey` FOREIGN KEY (`teamEntryId`) REFERENCES `TeamEntry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Riddle` ADD CONSTRAINT `Riddle_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamEntry` ADD CONSTRAINT `TeamEntry_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserEntry` ADD CONSTRAINT `UserEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserEntry` ADD CONSTRAINT `UserEntry_riddleId_fkey` FOREIGN KEY (`riddleId`) REFERENCES `Riddle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserEntry` ADD CONSTRAINT `UserEntry_teamEntryId_fkey` FOREIGN KEY (`teamEntryId`) REFERENCES `TeamEntry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

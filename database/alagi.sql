ALTER TABLE `parousia` CHANGE `excuse` `excuse` ENUM('ΕΝΤΑΞΕΙ','ΕΚΤΟΣ ΕΔΡΑΣ','ΑΙΜΟΔΟΣΙΑ','ΕΟΡΤΗ','ΑΣΘΕΝΕΙΑ','ΠΕΝΘΟΣ','ΕΚΤΑΚΤΩΣ','ΓΟΝΙΚΗ') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Αιτιολόγηση απουσίας';

USE `letrak`
;

ALTER TABLE `parousia` CHANGE `excuse` `excuse` ENUM('ΕΝΤΑΞΕΙ','ΕΚΤΟΣ ΕΔΡΑΣ','ΓΟΝΙΚΗ','ΑΙΜΟΔΟΣΙΑ','ΕΟΡΤΗ','ΑΣΘΕΝΕΙΑ','ΠΕΝΘΟΣ','ΕΚΤΑΚΤΩΣ','ΒΑΡΔΙΑ') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Αιτιολόγηση απουσίας';

USE `letrak`
;

ALTER TABLE `letrak`.`deltio`
DROP INDEX `protipo`,
ADD INDEX `protipo` (`protipo`) USING HASH;

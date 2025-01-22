CREATE VIEW `erpota`.`poupios` AS

SELECT
`erpota1`.`ipalilos`.`kodikos`,
`erpota1`.`ipalilos`.`eponimo`,
`erpota1`.`ipalilos`.`onoma`,
`erpota1`.`ipalilos`.`patronimo`,
`erpota`.`prosvasi`.`tilefono`,
`erpota`.`prosvasi`.`ipiresia`,
`erpota`.`prosvasi`.`level`,
`erpota`.`prosvasi`.`password`

FROM `erpota1`.`ipalilos`, `erpota`.`prosvasi`

WHERE `erpota1`.`ipalilos`.`kodikos` = `erpota`.`prosvasi`.`ipalilos`

;

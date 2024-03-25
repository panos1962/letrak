USE `letrak`
;

SELECT 'parousia', `ipalilos`, `deltio`, `karta`
FROM `parousia`
WHERE (`deltio` IN (
	SELECT `kodikos`
	FROM `deltio`
	WHERE (`prosapo` = 'ΑΠΟΧΩΡΗΣΗ')
	AND (`imerominia` >= '_ETAD_')
))
AND (`karta` IS NOT NULL)
ORDER BY `ipalilos`, `deltio`
;

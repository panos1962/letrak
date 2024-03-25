USE `letrak`
;

SELECT 'deltio', `kodikos`, `ipiresia`, `perigrafi`
FROM `deltio`
WHERE (`imerominia` >= '_ETAD_')
AND (`prosapo` = 'ΑΠΟΧΩΡΗΣΗ')
ORDER BY `kodikos`
;

USE `kartel`
;

SELECT 'event', `kodikos`, `meraora`, `karta`, `reader`
FROM `event`
WHERE (`meraora` BETWEEN '_DATE_ _APO_' AND '_DATE_ _EOS_')
AND (`reader` LIKE '_SITE_@%')
ORDER BY `kodikos`
;

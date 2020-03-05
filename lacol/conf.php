<?php
$x = getenv("LETRAK_BASEDIR");

if ($x === FALSE)
$x = "/var/opt/letrak";

define("LETRAK_BASEDIR", $x);
?>

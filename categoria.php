<?php
require_once "config.php";
header('Content-Type: text/html; charset=utf-8');
$valido['success']=array('success'=>false,'mensaje'=>"");


if ($_REQUEST['action']== "loadCategorias") {
              // Consulta para obtener los nombres de las categorías
        $sql = "SELECT categoria FROM categoria";
        $res = $cx->query($sql);
    
        // Array para almacenar los resultados
        $valido = array('nombre' => array());
    
        // Verifica si la consulta tuvo éxito y si hay filas en el resultado
        if ($res && $res->num_rows > 0) {
            while ($row = $res->fetch_assoc()) {
              
                $valido['nombre'][] = $row['categoria'];
            }
        }
    
        // Envía el array como respuesta en formato JSON
        echo json_encode($valido);
} 
$cx->close();



?>
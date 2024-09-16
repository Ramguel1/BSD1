<?php
require_once "config.php";
header('Content-Type: text/html; charset=utf-8');
$valido['success']=array('success'=>false,'mensaje'=>"");

if($_SERVER['REQUEST_METHOD']==='POST'){

 $action=$_REQUEST['action'];

switch($action){
    case "guardarGasto":
    
    $a=$_POST['descripcion'];
    $b=$_POST['costo'];
    $c = $_POST['categoria'];

    $sqlCategoria ="SELECT idcategoria FROM categoria WHERE categoria = '$c'";

    $resultCategoria = $cx->query($sqlCategoria);

    $row = $resultCategoria->fetch_assoc();
    $id_c = $row['idcategoria']; 

    $sql="INSERT INTO gasto VALUES (null,'$a','$b', '$id_c')";
    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="guardado";
    }else{
        $valido['success']=false;
       $valido['mensaje']="error"; 
    }
    

echo json_encode($valido);

break;

case "selectGastos":

    $sql = "SELECT ga.idgasto, ga.descripcion, ga.monto, c.categoria 
    FROM gasto ga
    INNER JOIN categoria c ON ga.idcategoria = c.idcategoria"; 

$registros=array('data'=>array());
$res=$cx->query($sql);
if($res->num_rows>0){
    while($row=$res->fetch_array()){
        $registros['data'][]=array($row[0],$row[1],$row[2],$row[3]);
    }
}

echo json_encode($registros);


break;

case "delete":
    if($_POST){
    $id=$_POST['id'];

    $sql="DELETE FROM gasto WHERE idgasto=$id";

    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="borrado";
    }else{
        $valido['success']=false;
       $valido['mensaje']="mal"; 
    }

}else{
$valido['success']=false;
$valido['mensaje']="error";
}
echo json_encode($valido);

break;
case "delete1":
    if($_POST){
    

    $sql="DELETE FROM gasto";

    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="eliminado";
    }else{
        $valido['success']=false;
       $valido['mensaje']="error"; 
    }

}else{
$valido['success']=false;
$valido['mensaje']="error";
}
echo json_encode($valido);

break;
case "select":
    header('Content-Type: text/html; charset=utf-8');
            $valido['success']=array('success'=>false,
            'mensaje'=>"",
            'id'=>"",
            'descripcion'=>"",
            'costo'=>"",
            'categoria'=>"");
            if ($_POST) {
                $id = $_POST['id'];

                $sql = "SELECT ga.idgasto, ga.descripcion, ga.monto, c.categoria
                FROM gasto ga
                INNER JOIN categoria c ON ga.idcategoria = c.idcategoria
                WHERE ga.idgasto = $id";


                $res = $cx->query($sql);
                $row = $res->fetch_array();
            
                $valido['success'] = true;
                $valido['mensaje'] = "bien";
            
                $valido['id'] = $row[0];
                $valido['descripcion'] = $row[1];
                $valido['costo'] = $row[2];
                $valido['categoria'] = $row[3];
            } else {
                $valido['success'] = false;
                $valido['mensaje'] = "error";
            }
            

echo json_encode($valido);

break;

case "updateGasto":

    if($_POST){

    $id=$_POST['id'];
    $a=$_POST['descripcion'];
    $b=$_POST['costo'];
    $c=$_POST['categoria'];


    $sql_categoria = "SELECT idcategoria FROM categoria WHERE categoria = '$c'";
    $result_categoria = $cx->query($sql_categoria);

    if ($result_categoria->num_rows > 0) {
        $row_categoria = $result_categoria->fetch_assoc();
        $id_c = $row_categoria['idcategoria'];

        $sql_update = "UPDATE gasto SET descripcion='$a', monto='$b', idcategoria='$id_c' WHERE idgasto='$id'";

        if ($cx->query($sql_update)) {
            $valido['success'] = true;
            $valido['mensaje'] = "";
        } else {
            $valido['success'] = false;
            $valido['mensaje'] = "no se actualizo";
        }
    } else {
        $valido['success'] = false;
        $valido['mensaje'] = "error";
    }
} else {
    $valido['success'] = false;
    $valido['mensaje'] = "mal";
}

echo json_encode($valido);
break;
}

}else{
 echo json_encode(["error" => "Método no permitido"]);
}

?>
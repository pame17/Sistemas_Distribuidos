id=$(curl -d "nombre=Melon&apellido=Musk&rut=1&email=Xmelon_muskX@fruitter.com&fecha_nacimiento=28-06-1971&comentario=Amigdalitis&farmacos=Paracetamol&doctor=El Waton de la Fruta" -X POST http://localhost:8000/create)
echo -e "Info pacientes y recetas:"
curl --location --request GET 'http://localhost:8000/pacientes'
echo -e "\n"
curl --location --request GET 'http://localhost:8000/recetas'
echo -e "\n"
curl -d "nombre=Melon&apellido=Musk&rut=1&email=Xmelon_muskX@fruitter.com&fecha_nacimiento=28/06/1971&comentario=otraReceta&farmacos=otroFarmaco&doctor=otroDostor" -X POST http://localhost:8000/create
echo -e "\nInfo pacientes y recetas despues de agregar una nueva receta"
curl --location --request GET 'http://localhost:8000/pacientes'
echo -e "\n"
curl --location --request GET 'http://localhost:8000/recetas'
echo -e "\nInfo pacientes y recetas luego de modificar la receta $id"
curl -d "id=$id&comentario=nuevoComenatario&farmacos=nuevoFarmaco&doctor=nuevoDoctor" -X POST http://localhost:8000/edit
echo -e "\n"
curl --location --request GET 'http://localhost:8000/recetas'
echo -e "\nRecetas despues de eliminar $id"
curl -d "id=$id" -X POST http://localhost:8000/delete
echo -e "\n"
curl --location --request GET 'http://localhost:8000/recetas'

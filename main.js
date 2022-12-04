let entrada = document.getElementById("entrada");
var salida = document.getElementById("salida");
var boton = document.getElementById("boton");

var Arreglo_formato = ["0000000", "0100000", "000", "0110011", "011", "0000011", "0100011","1100011","001","1101111","1100111"];
let arreglo_arreglos=[];
//funct7 suma, funct7 resta, funct3 suma y resta, opcdode suma y resta, inmediate ls. funct3 ls, opcode ls , opcode beq y bne, fucnt3 bne
var funct7;
var rs2;
var rs1;
var rd;
var funct3;
var opcode;
var inmediate;
//000000=add, 0100000=sub , funct3 =000, opcode = 0110011 mismos en add ysub ,inmediate ld, funct 3 =011, 
boton.addEventListener('click', () => {
    validarEntrada();
    salida.value = separarCodigo();
    //salida2.value = separarCodigo(entrada2);

});

const validarEntrada = () => {
    (entrada.value === "") ? alert("ingrese un codigo") : console.log("todo bien");
    //(entrada2.value === "") ? alert("ingrese un codigo") : console.log("todo bien");

}
const separarCodigo = () => {
    //primer separar el arreglo recibido por el \n
    let arreglo_instrucciones=entrada.value.split(/\n/);
  //ya separado entonces ahora separar instruccion por instrucion:
  
    let final=[];
    console.log(arreglo_instrucciones);
    var instruccion_separada;
    var auxiliar;
    //primer for para leer todas las intrucciones y tener un arreglo de arreglos 
    for (let i = 0; i < arreglo_instrucciones.length; i+=1) {//primero separamos una instruccion del arreglo
        instruccion_separada = arreglo_instrucciones[i];//la pasamos al areglo instruccion separada
        var aux=instruccion_separada.split(/( |x|[()]|:|,)/);
        //console.log(aux[0]);
        //console.log(aux.filter(el => el != ''))
        auxiliar=aux.filter(el => el != '');
        arreglo_arreglos[i]=auxiliar.filter(coma =>coma != ",");//sal es un arreglo de arreglos 
    }
     //Segundo for para decodificar las instrucciones 
    for (const j in arreglo_arreglos) {
        //console.log(arreglo_arreglos[j]);
       final[j]=convertirCodigo(arreglo_arreglos[j],j);
    }
    /*let codigos = entrada_codigo.value.split(/(,| |x|[()]|\n)/);
     final[i]=convertirCodigo(sal[i]);
    return final
  */ 
    return final;
}

function buscar_etiquetas(todas_instrucciones,etiqueta_buscada,pos_actual) {
    let aux=[];
    var pos;
    for (let a = 0; a < todas_instrucciones.length; a++) {
        aux=todas_instrucciones[a];
        if(aux.includes(etiqueta_buscada)){
            if(a!=pos_actual){
                 pos=a-pos_actual;
            }
            console.log("encontro: ",a);
        }
    }

    if (pos<0){//el numero es negativo hay que transformalo a complemento 2 
        var num=pos*(-1);
        //ya en positivo 
        if(num>0 && num<16){
             pos=16-num;
        }
        if(num>15 && num<32){
            pos=32-num;
        }
    }
    return pos;
}
function functionbeq(codigo,pos) {
    var i = 0;
    var num = 1;
    var binario;
    var inmediate1;
    var inmediate2;
    var inmediate;
    var cincob;
    var bit;
    let bin = [];//arreglo de inmediate de 12 bits 
    while (i < codigo.length) {
        var parte = codigo[i];
        if(parte != " "){ //si no es un espacio en blanco
            if (!isNaN(parte)) {
                if (num == 1) {
                    //como es el primer numero entonces es el rs1 
                    console.log(parte)
                    bin = convert(parte,10,2);//convertir a binario con la funcion convert 
                    rs1 = concatenarCeros(parte, bin);
                }
                if (num == 2) {
                    console.log(parte)//Segundo numero es el rs2
                    bin = convert(parte,10,2);//cinvertir  binario con la funcion convert
                    rs2 = concatenarCeros(parte, bin);
    
                }
                //Caso en el que el salto esta dado como un numero:
                if (num==3) {
                    cincob=convert(parte,10,2);
                    bin = concatenarCeros(parte, cincob);
                    console.log(bin);
                    bit = bin.length - 5;
                    inmediate1 = bin.slice(bit, bin.length);
                    inmediate2 = bin.slice(0, bit);
                    console.log(inmediate1);
                    console.log(inmediate2);
                }
                num += 1
            }
            if(num==3 && isNaN(parte)){//si ya se leyeron los dos primeros resgistros entonces viene la etiqueta
                //etiqueta reconocida 
                console.log(parte);
               var inm= buscar_etiquetas(arreglo_arreglos,parte,pos);
               console.log("INM BEQ:",inm);
                cincob=convert(inm,10,2);
               bin = concatenarCeros(inm, cincob);
               console.log(bin);
                bit = bin.length - 5;
               inmediate1 = bin.slice(bit, bin.length);
               inmediate2 = bin.slice(0, bit);
               console.log(inmediate1);
               console.log(inmediate2);

            }
        }
       
        i += 1;
    }
    
    inmediate = String(inmediate2).padStart(7, '0');
    funct3 = Arreglo_formato[2];//000 en funct3 para la instruccion en beq
    opcode = Arreglo_formato[7];//opcode de la instruccion beq 
    return binario = inmediate + rs2 + rs1 + funct3 + inmediate1 + opcode;
}
  
function funcionbne(codigo,pos) {
    console.log(codigo);
    var i = 0;
    var num = 1;
    var binario;
    var inmediate1;
    var inmediate2;
    var inmediate;
    var cincob;
    var bit;
    let bin = [];//arreglo de inmediate de 12 bits 
    while (i < codigo.length) {
        var parte = codigo[i];
        if(parte != " "){ //si no es un espacio en blanco
            if (!isNaN(parte)) {
                if (num == 1) {
                    //como es el primer numero entonces es el rs1 
                    console.log(parte)
                    bin = convert(parte,10,2);//convertir a binario con la funcion convert 
                    rs1 = concatenarCeros(parte, bin);
                }
                if (num == 2) {
                    console.log(parte)//Segundo numero es el rs2
                    bin = convert(parte,10,2);//cinvertir  binario con la funcion convert
                    rs2 = concatenarCeros(parte, bin);
    
                }
                //Caso en el que el salto esta dado como un numero:
                if (num==3) {
                    cincob=convert(parte,10,2);
                    bin = concatenarCeros(parte, cincob);
                    console.log(bin);
                    bit = bin.length - 5;
                    inmediate1 = bin.slice(bit, bin.length);
                    inmediate2 = bin.slice(0, bit);
                    console.log(inmediate1);
                    console.log(inmediate2);
                }
                num += 1
            }
            if(num==3 && isNaN(parte)){//si ya se leyeron los dos primeros resgistros entonces viene la etiqueta
                //etiqueta reconocida 
                console.log(parte);
               var inm= buscar_etiquetas(arreglo_arreglos,parte,pos);//numero inmediate
               console.log("INM BEQ:",inm);
                cincob=convert(inm,10,2);
               bin = concatenarCeros(inm, cincob);
               console.log(bin);
                bit = bin.length - 5;
               inmediate1 = bin.slice(bit, bin.length);
               inmediate2 = bin.slice(0, bit);
               console.log(inmediate1);
    

            }
        }
       
        i += 1;
    }
    
    inmediate = String(inmediate2).padStart(7, '0');
    console.log(inmediate);
    funct3 = Arreglo_formato[8];//001 en funct3 para la instruccion en bne
    opcode = Arreglo_formato[7];//opcode de la instruccion bne 
    return binario = inmediate + rs2 + rs1 + funct3 + inmediate1 + opcode;
}

function funcionJal(codigo1,pos) {
    var i = 1;
    var num = 1;
    var binario;
    let bin = [];//arreglo de inmediate de 12 bits 
    while (i < codigo1.length) {
        var parte = codigo1[i];//empezamos desde la posicion 1 por que la posicion 0 ya se sabe que es ld 
        if(parte!=" "){
            if (!isNaN(parte)) {
                if (num == 1) {
                    //como es el primer numero entonces es el rd 
                    console.log(parte)
                    bin = convert(parte,10,2);
                    rd = concatenarCeros(parte, bin);
                }
                if (num == 2) {
                    //segundo numero entonces puede que sea el caso de una direccion a donde saltar
                    console.log(parte)
                    bin = convert(parte,10,2);
                    inmediate = String(bin).padStart(20, '0');
    
                }
                num += 1
            }
            if(num==2 && isNaN(parte)){//si ya se leyeron los dos primeros resgistros entonces viene la etiqueta
                //etiqueta reconocida 
                console.log(parte);
               var inm= buscar_etiquetas(arreglo_arreglos,parte,pos);
               console.log("INM BEQ:",inm);
                cincob=convert(inm,10,2);
               bin = concatenarCeros(inm, cincob);
               console.log(bin);
               inmediate = String(bin).padStart(20, '0');
               console.log(inmediate);
               

            }

        }
        
        i += 1;
    }
    opcode = Arreglo_formato[9];
    return binario = inmediate + rd + opcode;
}

function funsd(codigo) {
    var i = 1;
    var num = 1;
    var binario;
    let bin = [];
    var inmediate1;
    var inmediate2;
    let cincob = 0;
    while (i < codigo.length) {
        var parte = codigo[i];//empezamos desde la posicion 1 por que la posicion 0 ya se sabe que es ld 
        if(parte!=" "){
            if (!isNaN(parte)) {
                if (num == 1) {
                    //como es el primer numero entonces es el rs2 
                    console.log(parte)
                    bin = convert(parte,10,2);
                    rs2 = concatenarCeros(parte, bin);
                }
                if (num == 2) {
                    //segundo numero entonces el registro , pero puede que sea numero entre 0 y 32
                    console.log(parte)
                    cincob = convert(parte,10,2);//en bin esta el numero de registro convertido en binario
                    bin = concatenarCeros(parte, cincob);
                    console.log(bin);
                    var bit = bin.length - 5;
    
                    inmediate1 = bin.slice(bit, bin.length);
                    inmediate2 = bin.slice(0, bit);
                    console.log(inmediate1);
                    console.log(inmediate2);
    
                }
                if (num == 3) {
                    //Es el rs1 
                    console.log(parte)
                    bin = convert(parte,10,2);
                    rs1 = concatenarCeros(parte, bin);
                }
                num += 1
            }
        }
        
        i += 1;
    }
    inmediate = String(inmediate2).padStart(7, '0');
    funct3 = Arreglo_formato[4];
    opcode = Arreglo_formato[6];
    return binario = inmediate + rs2 + rs1 + funct3 + inmediate1 + opcode;
}

function convertirCodigo(codigo1,pos) {
  
    var hexa;
    let bin=[0];
    if (codigo1.includes("add")) {
        console.log("encontro add");
        funct7 = Arreglo_formato[0]; //funct7 = 0000000
       bin = suma_resta(codigo1);
    }
    else if(codigo1.includes("sub")) {
        console.log("encontro sub");
        funct7 = Arreglo_formato[1]; //funct7 = 0100000
        bin = suma_resta(codigo1);
    }
    else if(codigo1.includes("ld")) {
        console.log("encontro ld");
        bin = funld(codigo1);
    }
    else if(codigo1.includes("sd")) {
        console.log("encontro sd");
        bin = funsd(codigo1);

    }else if(codigo1.includes("beq")){
        console.log("encontro beq");
       bin= functionbeq(codigo1,pos);

    }else if(codigo1.includes("bne")){
        console.log("encontro bne");
        bin=funcionbne(codigo1,pos);
    }else if(codigo1.includes("jal")){
        console.log("encontro jal");
        bin=funcionJal(codigo1,pos);
        //functionbeq(codigo1);

    }else if(codigo1.includes("jalr")){
        console.log("encontro jalr");
        bin=funcionJalr(codigo1);
    }

    console.log(bin);
    hexa = converHexa(bin);
     console.log(hexa);
    return hexa;

}


function funcionJalr(codigo1) {
    var i = 1;
    var num = 1;
    var binario;
    let bin = [];//arreglo de inmediate de 12 bits 
    while (i < codigo1.length) {
        var parte = codigo1[i];//empezamos desde la posicion 1 por que la posicion 0 ya se sabe que es ld 
        if(parte!=" "){
            if (!isNaN(parte)) {//Si es un numero 
                if (num == 1) {
                    //como es el primer numero entonces es el rd 
                    console.log(parte)
                    bin = convert(parte,10,2);
                    rd = concatenarCeros(parte, bin);
                }
                if (num == 2) {
                    //segundo numero entonces el registro , pero puede que sea numero entre 0 y 32
                    console.log(parte)
                    bin = convert(parte,10,2);
                    inmediate = String(bin).padStart(12, '0');
    
                }
                if (num == 3) {
                    //Es el rs1 
                    console.log(parte)
                    bin = convert(parte,10,2);
                    rs1 = concatenarCeros(parte, bin);
                }
                num += 1
            }
            
        }
        
        i += 1;
    }

    funct3 = Arreglo_formato[2];
    opcode = Arreglo_formato[10];
    return binario = inmediate + rs1 + funct3 + rd + opcode;
}

function converHexa(numero) {
    let arreglo1 = [8];
    arreglo1[0] = numero.slice(0, 4);
    arreglo1[1] = numero.slice(4, 8);
    arreglo1[2] = numero.slice(8, 12);
    arreglo1[3] = numero.slice(12, 16);
    arreglo1[4] = numero.slice(16, 20);
    arreglo1[5] = numero.slice(20, 24);
    arreglo1[6] = numero.slice(24, 28);
    arreglo1[7] = numero.slice(28, 32);
    console.log(arreglo1[0]);
    console.log(arreglo1[1]);
    console.log(arreglo1[2]);
    console.log(arreglo1[3]);
    console.log(arreglo1[4]);
    console.log(arreglo1[5]);
    console.log(arreglo1[6]);
    console.log(arreglo1[7]);
    var uno = convert(arreglo1[0], 2, 16);
    var dos = convert(arreglo1[1], 2, 16);
    var tres = convert(arreglo1[2], 2, 16);
    var cuatro = convert(arreglo1[3], 2, 16);
    var cinco = convert(arreglo1[4], 2, 16);
    var seis = convert(arreglo1[5], 2, 16);
    var siete = convert(arreglo1[6], 2, 16);
    var ocho = convert(arreglo1[7], 2, 16);

    var hexa = uno + dos + tres + cuatro + cinco + seis + siete + ocho;
    return hexa;

}

function concatenarCeros(parte, bin) {
    if (parte == 1) {
        bin = "0000" + bin;
    }
    if (parte > 1 && parte < 4) {
        bin = "000" + bin;
    }
    if (parte >= 4 && parte < 8) {
        bin = "00" + bin;
    }
    if (parte >= 8 && parte < 16) {
      
        bin = "0" + bin;
    }
    if(parte==0){
        bin="00000";
    }
    return bin;
}

function convert(valor, Baseentrada, basesalida) {
    return Number(parseInt(valor, Baseentrada)).toString(basesalida);
}


function suma_resta(codigo) {
    console.log(codigo);
    var i = 1;
    var num = 1;
    var binario;
    let bin;
    while (i < codigo.length) {
        var parte = codigo[i];//empezamos desde la posicion 1 por que la posicion 0 ya se sabe que es add 
      if(parte!=" "){//si no es un espacio
        if (!isNaN(parte)) {
            if (num == 1) {
                //como es el primer numero entonces es el rd 
                console.log(parte);
                bin = convert(parte,10,2);
                rd = concatenarCeros(parte, bin);
            }
            if (num == 2) {
                //segundo numero entonces el rs1
                console.log(parte)
                bin = convert(parte,10,2);
                rs1 = concatenarCeros(parte, bin);
            }
            if (num == 3) {
                //tercer numero entonces es el rs2 
                console.log(parte)
                bin = convert(parte,10,2);
                rs2 = concatenarCeros(parte, bin);
            }
            num += 1
        }
      }
        i += 1;
    }
    funct3 = Arreglo_formato[2];
    opcode = Arreglo_formato[3];
    binario = funct7 + rs2 + rs1 + funct3 + rd + opcode;
    return binario;
}

function funld(codigo) {
    var i = 1;
    var num = 1;
    var binario;
    let bin = [];//arreglo de inmediate de 12 bits 
    while (i < codigo.length) {
        var parte = codigo[i];//empezamos desde la posicion 1 por que la posicion 0 ya se sabe que es ld 
        if(parte!=" "){
            if (!isNaN(parte)) {
                if (num == 1) {
                    //como es el primer numero entonces es el rd 
                    console.log(parte)
                    bin = convert(parte,10,2);
                    rd = concatenarCeros(parte, bin);
                }
                if (num == 2) {
                    //segundo numero entonces el registro , pero puede que sea numero entre 0 y 32
                    console.log(parte)
                    bin = convert(parte,10,2);
                    inmediate = String(bin).padStart(12, '0');
    
                }
                if (num == 3) {
                    //Es el rs1 
                    console.log(parte)
                    bin = convert(parte,10,2);
                    rs1 = concatenarCeros(parte, bin);
                }
                num += 1
            }
        }
        
        i += 1;
    }

    funct3 = Arreglo_formato[4];
    opcode = Arreglo_formato[5];
    return binario = inmediate + rs1 + funct3 + rd + opcode;
}

function funsd(codigo) {
    var i = 1;
    var num = 1;
    var binario;
    let bin = [];
    var inmediate1;
    var inmediate2;
    let cincob = 0;
    while (i < codigo.length) {
        var parte = codigo[i];//empezamos desde la posicion 1 por que la posicion 0 ya se sabe que es ld 
        if(parte!=" "){
            if (!isNaN(parte)) {
                if (num == 1) {
                    //como es el primer numero entonces es el rs2 
                    console.log(parte)
                    bin = convert(parte,10,2);
                    rs2 = concatenarCeros(parte, bin);
                }
                if (num == 2) {
                    //segundo numero entonces el registro , pero puede que sea numero entre 0 y 32
                    console.log(parte)
                    cincob = convert(parte,10,2);//en bin esta el numero de registro convertido en binario
                    bin = concatenarCeros(parte, cincob);
                    console.log(bin);
                    var bit = bin.length - 5;
    
                    inmediate1 = bin.slice(bit, bin.length);
                    inmediate2 = bin.slice(0, bit);
                    console.log(inmediate1);
                    console.log(inmediate2);
    
                }
                if (num == 3) {
                    //Es el rs1 
                    console.log(parte)
                    bin = convert(parte,10,2);
                    rs1 = concatenarCeros(parte, bin);
                }
                num += 1
            }
        }
        
        i += 1;
    }
    inmediate = String(inmediate2).padStart(7, '0');
    funct3 = Arreglo_formato[4];
    opcode = Arreglo_formato[6];
    return binario = inmediate + rs2 + rs1 + funct3 + inmediate1 + opcode;
}



window.STORE_CONFIG = { envioBase: 15 };
fetch('/api/config').then(r => r.json()).then(data => {
    if(data && typeof data.envioBase !== 'undefined') window.STORE_CONFIG = data;
}).catch(e => console.log('Config fetch failed'));

const sll_init_landing = () => {
    // === CONFIG DATA ===
    // Dataset completo de Perú: Departamento - Provincia - Distrito
    const PERU_LOCATIONS = [
        'Amazonas - Bagua - Aramango',
        'Amazonas - Bagua - Bagua',
        'Amazonas - Bagua - Copallin',
        'Amazonas - Bagua - El Parco',
        'Amazonas - Bagua - Imaza',
        'Amazonas - Bagua - La Peca',
        'Amazonas - Bongará - Chisquilla',
        'Amazonas - Bongará - Churuja',
        'Amazonas - Bongará - Corosha',
        'Amazonas - Bongará - Cuispes',
        'Amazonas - Bongará - Florida',
        'Amazonas - Bongará - Jazan',
        'Amazonas - Bongará - Jumbilla',
        'Amazonas - Bongará - Recta',
        'Amazonas - Bongará - San Carlos',
        'Amazonas - Bongará - Shipasbamba',
        'Amazonas - Bongará - Valera',
        'Amazonas - Bongará - Yambrasbamba',
        'Amazonas - Chachapoyas - Asunción',
        'Amazonas - Chachapoyas - Balsas',
        'Amazonas - Chachapoyas - Chachapoyas',
        'Amazonas - Chachapoyas - Cheto',
        'Amazonas - Chachapoyas - Chiliquin',
        'Amazonas - Chachapoyas - Chuquibamba',
        'Amazonas - Chachapoyas - Granada',
        'Amazonas - Chachapoyas - Huancas',
        'Amazonas - Chachapoyas - La Jalca',
        'Amazonas - Chachapoyas - Leimebamba',
        'Amazonas - Chachapoyas - Levanto',
        'Amazonas - Chachapoyas - Magdalena',
        'Amazonas - Chachapoyas - Mariscal Castilla',
        'Amazonas - Chachapoyas - Molinopampa',
        'Amazonas - Chachapoyas - Montevideo',
        'Amazonas - Chachapoyas - Olleros',
        'Amazonas - Chachapoyas - Quinjalca',
        'Amazonas - Chachapoyas - San Francisco de Daguas',
        'Amazonas - Chachapoyas - San Isidro de Maino',
        'Amazonas - Chachapoyas - Soloco',
        'Amazonas - Chachapoyas - Sonche',
        'Amazonas - Condorcanqui - El Cenepa',
        'Amazonas - Condorcanqui - Nieva',
        'Amazonas - Condorcanqui - Río Santiago',
        'Amazonas - Luya - Camporredondo',
        'Amazonas - Luya - Cocabamba',
        'Amazonas - Luya - Colcamar',
        'Amazonas - Luya - Conila',
        'Amazonas - Luya - Inguilpata',
        'Amazonas - Luya - Lamud',
        'Amazonas - Luya - Longuita',
        'Amazonas - Luya - Lonya Chico',
        'Amazonas - Luya - Luya',
        'Amazonas - Luya - Luya Viejo',
        'Amazonas - Luya - María',
        'Amazonas - Luya - Ocalli',
        'Amazonas - Luya - Ocumal',
        'Amazonas - Luya - Pisuquia',
        'Amazonas - Luya - Providencia',
        'Amazonas - Luya - San Cristóbal',
        'Amazonas - Luya - San Francisco de Yeso',
        'Amazonas - Luya - San Jerónimo',
        'Amazonas - Luya - San Juan de Lopecancha',
        'Amazonas - Luya - Santa Catalina',
        'Amazonas - Luya - Santo Tomas',
        'Amazonas - Luya - Tingo',
        'Amazonas - Luya - Trita',
        'Amazonas - Rodríguez de Mendoza - Chirimoto',
        'Amazonas - Rodríguez de Mendoza - Cochamal',
        'Amazonas - Rodríguez de Mendoza - Huambo',
        'Amazonas - Rodríguez de Mendoza - Limabamba',
        'Amazonas - Rodríguez de Mendoza - Longar',
        'Amazonas - Rodríguez de Mendoza - Mariscal Benavides',
        'Amazonas - Rodríguez de Mendoza - Milpuc',
        'Amazonas - Rodríguez de Mendoza - Omia',
        'Amazonas - Rodríguez de Mendoza - San Nicolás',
        'Amazonas - Rodríguez de Mendoza - Santa Rosa',
        'Amazonas - Rodríguez de Mendoza - Totora',
        'Amazonas - Rodríguez de Mendoza - Vista Alegre',
        'Amazonas - Utcubamba - Bagua Grande',
        'Amazonas - Utcubamba - Cajaruro',
        'Amazonas - Utcubamba - Cumba',
        'Amazonas - Utcubamba - El Milagro',
        'Amazonas - Utcubamba - Jamalca',
        'Amazonas - Utcubamba - Lonya Grande',
        'Amazonas - Utcubamba - Yamon',
        'Áncash - Aija - Aija',
        'Áncash - Aija - Coris',
        'Áncash - Aija - Huacllan',
        'Áncash - Aija - La Merced',
        'Áncash - Aija - Succha',
        'Áncash - Antonio Raymondi - Aczo',
        'Áncash - Antonio Raymondi - Chaccho',
        'Áncash - Antonio Raymondi - Chingas',
        'Áncash - Antonio Raymondi - Llamellin',
        'Áncash - Antonio Raymondi - Mirgas',
        'Áncash - Antonio Raymondi - San Juan de Rontoy',
        'Áncash - Asunción - Acochaca',
        'Áncash - Asunción - Chacas',
        'Áncash - Bolognesi - Abelardo Pardo Lezameta',
        'Áncash - Bolognesi - Antonio Raymondi',
        'Áncash - Bolognesi - Aquia',
        'Áncash - Bolognesi - Cajacay',
        'Áncash - Bolognesi - Canis',
        'Áncash - Bolognesi - Chiquian',
        'Áncash - Bolognesi - Colquioc',
        'Áncash - Bolognesi - Huallanca',
        'Áncash - Bolognesi - Huasta',
        'Áncash - Bolognesi - Huayllacayan',
        'Áncash - Bolognesi - La Primavera',
        'Áncash - Bolognesi - Mangas',
        'Áncash - Bolognesi - Pacllon',
        'Áncash - Bolognesi - San Miguel de Corpanqui',
        'Áncash - Bolognesi - Ticllos',
        'Áncash - Carhuaz - Acopampa',
        'Áncash - Carhuaz - Amashca',
        'Áncash - Carhuaz - Anta',
        'Áncash - Carhuaz - Ataquero',
        'Áncash - Carhuaz - Carhuaz',
        'Áncash - Carhuaz - Marcara',
        'Áncash - Carhuaz - Pariahuanca',
        'Áncash - Carhuaz - San Miguel de Aco',
        'Áncash - Carhuaz - Shilla',
        'Áncash - Carhuaz - Tinco',
        'Áncash - Carhuaz - Yungar',
        'Áncash - Carlos Fermín Fitzcarrald - San Luis',
        'Áncash - Carlos Fermín Fitzcarrald - San Nicolás',
        'Áncash - Carlos Fermín Fitzcarrald - Yauya',
        'Áncash - Casma - Buena Vista Alta',
        'Áncash - Casma - Casma',
        'Áncash - Casma - Comandante Noel',
        'Áncash - Casma - Yautan',
        'Áncash - Corongo - Aco',
        'Áncash - Corongo - Bambas',
        'Áncash - Corongo - Corongo',
        'Áncash - Corongo - Cusca',
        'Áncash - Corongo - La Pampa',
        'Áncash - Corongo - Yanac',
        'Áncash - Corongo - Yupan',
        'Áncash - Huaraz - Cochabamba',
        'Áncash - Huaraz - Colcabamba',
        'Áncash - Huaraz - Huanchay',
        'Áncash - Huaraz - Huaraz',
        'Áncash - Huaraz - Independencia',
        'Áncash - Huaraz - Jangas',
        'Áncash - Huaraz - La Libertad',
        'Áncash - Huaraz - Olleros',
        'Áncash - Huaraz - Pampas Grande',
        'Áncash - Huaraz - Pariacoto',
        'Áncash - Huaraz - Pira',
        'Áncash - Huaraz - Tarica',
        'Áncash - Huari - Anra',
        'Áncash - Huari - Cajay',
        'Áncash - Huari - Chavin de Huantar',
        'Áncash - Huari - Huacachi',
        'Áncash - Huari - Huacchis',
        'Áncash - Huari - Huachis',
        'Áncash - Huari - Huantar',
        'Áncash - Huari - Huari',
        'Áncash - Huari - Masin',
        'Áncash - Huari - Paucas',
        'Áncash - Huari - Ponto',
        'Áncash - Huari - Rahuapampa',
        'Áncash - Huari - Rapayan',
        'Áncash - Huari - San Marcos',
        'Áncash - Huari - San Pedro de Chana',
        'Áncash - Huari - Uco',
        'Áncash - Huarmey - Cochapeti',
        'Áncash - Huarmey - Culebras',
        'Áncash - Huarmey - Huarmey',
        'Áncash - Huarmey - Huayan',
        'Áncash - Huarmey - Malvas',
        'Áncash - Huaylas - Caraz',
        'Áncash - Huaylas - Huallanca',
        'Áncash - Huaylas - Huata',
        'Áncash - Huaylas - Huaylas',
        'Áncash - Huaylas - Mato',
        'Áncash - Huaylas - Pamparomas',
        'Áncash - Huaylas - Pueblo Libre',
        'Áncash - Huaylas - Santa Cruz',
        'Áncash - Huaylas - Santo Toribio',
        'Áncash - Huaylas - Yuracmarca',
        'Áncash - Mariscal Luzuriaga - Casca',
        'Áncash - Mariscal Luzuriaga - Eleazar Guzmán Barron',
        'Áncash - Mariscal Luzuriaga - Fidel Olivas Escudero',
        'Áncash - Mariscal Luzuriaga - Llama',
        'Áncash - Mariscal Luzuriaga - Llumpa',
        'Áncash - Mariscal Luzuriaga - Lucma',
        'Áncash - Mariscal Luzuriaga - Musga',
        'Áncash - Mariscal Luzuriaga - Piscobamba',
        'Áncash - Ocros - Acas',
        'Áncash - Ocros - Cajamarquilla',
        'Áncash - Ocros - Carhuapampa',
        'Áncash - Ocros - Cochas',
        'Áncash - Ocros - Congas',
        'Áncash - Ocros - Llipa',
        'Áncash - Ocros - Ocros',
        'Áncash - Ocros - San Cristóbal de Rajan',
        'Áncash - Ocros - San Pedro',
        'Áncash - Ocros - Santiago de Chilcas',
        'Áncash - Pallasca - Bolognesi',
        'Áncash - Pallasca - Cabana',
        'Áncash - Pallasca - Conchucos',
        'Áncash - Pallasca - Huacaschuque',
        'Áncash - Pallasca - Huandoval',
        'Áncash - Pallasca - Lacabamba',
        'Áncash - Pallasca - Llapo',
        'Áncash - Pallasca - Pallasca',
        'Áncash - Pallasca - Pampas',
        'Áncash - Pallasca - Santa Rosa',
        'Áncash - Pallasca - Tauca',
        'Áncash - Pomabamba - Huayllan',
        'Áncash - Pomabamba - Parobamba',
        'Áncash - Pomabamba - Pomabamba',
        'Áncash - Pomabamba - Quinuabamba',
        'Áncash - Recuay - Catac',
        'Áncash - Recuay - Cotaparaco',
        'Áncash - Recuay - Huayllapampa',
        'Áncash - Recuay - Llacllin',
        'Áncash - Recuay - Marca',
        'Áncash - Recuay - Pampas Chico',
        'Áncash - Recuay - Pararin',
        'Áncash - Recuay - Recuay',
        'Áncash - Recuay - Tapacocha',
        'Áncash - Recuay - Ticapampa',
        'Áncash - Santa - Cáceres del Perú',
        'Áncash - Santa - Chimbote',
        'Áncash - Santa - Coishco',
        'Áncash - Santa - Macate',
        'Áncash - Santa - Moro',
        'Áncash - Santa - Nepeña',
        'Áncash - Santa - Nuevo Chimbote',
        'Áncash - Santa - Samanco',
        'Áncash - Santa - Santa',
        'Áncash - Sihuas - Acobamba',
        'Áncash - Sihuas - Alfonso Ugarte',
        'Áncash - Sihuas - Cashapampa',
        'Áncash - Sihuas - Chingalpo',
        'Áncash - Sihuas - Huayllabamba',
        'Áncash - Sihuas - Quiches',
        'Áncash - Sihuas - Ragash',
        'Áncash - Sihuas - San Juan',
        'Áncash - Sihuas - Sicsibamba',
        'Áncash - Sihuas - Sihuas',
        'Áncash - Yungay - Cascapara',
        'Áncash - Yungay - Mancos',
        'Áncash - Yungay - Matacoto',
        'Áncash - Yungay - Quillo',
        'Áncash - Yungay - Ranrahirca',
        'Áncash - Yungay - Shupluy',
        'Áncash - Yungay - Yanama',
        'Áncash - Yungay - Yungay',
        'Apurímac - Abancay - Abancay',
        'Apurímac - Abancay - Chacoche',
        'Apurímac - Abancay - Circa',
        'Apurímac - Abancay - Curahuasi',
        'Apurímac - Abancay - Huanipaca',
        'Apurímac - Abancay - Lambrama',
        'Apurímac - Abancay - Pichirhua',
        'Apurímac - Abancay - San Pedro de Cachora',
        'Apurímac - Abancay - Tamburco',
        'Apurímac - Andahuaylas - Andahuaylas',
        'Apurímac - Andahuaylas - Andarapa',
        'Apurímac - Andahuaylas - Chiara',
        'Apurímac - Andahuaylas - Huancarama',
        'Apurímac - Andahuaylas - Huancaray',
        'Apurímac - Andahuaylas - Huayana',
        'Apurímac - Andahuaylas - José María Arguedas',
        'Apurímac - Andahuaylas - Kaquiabamba',
        'Apurímac - Andahuaylas - Kishuara',
        'Apurímac - Andahuaylas - Pacobamba',
        'Apurímac - Andahuaylas - Pacucha',
        'Apurímac - Andahuaylas - Pampachiri',
        'Apurímac - Andahuaylas - Pomacocha',
        'Apurímac - Andahuaylas - San Antonio de Cachi',
        'Apurímac - Andahuaylas - San Jerónimo',
        'Apurímac - Andahuaylas - San Miguel de Chaccrampa',
        'Apurímac - Andahuaylas - Santa María de Chicmo',
        'Apurímac - Andahuaylas - Talavera',
        'Apurímac - Andahuaylas - Tumay Huaraca',
        'Apurímac - Andahuaylas - Turpo',
        'Apurímac - Antabamba - Antabamba',
        'Apurímac - Antabamba - El Oro',
        'Apurímac - Antabamba - Huaquirca',
        'Apurímac - Antabamba - Juan Espinoza Medrano',
        'Apurímac - Antabamba - Oropesa',
        'Apurímac - Antabamba - Pachaconas',
        'Apurímac - Antabamba - Sabaino',
        'Apurímac - Aymaraes - Capaya',
        'Apurímac - Aymaraes - Caraybamba',
        'Apurímac - Aymaraes - Chalhuanca',
        'Apurímac - Aymaraes - Chapimarca',
        'Apurímac - Aymaraes - Colcabamba',
        'Apurímac - Aymaraes - Cotaruse',
        'Apurímac - Aymaraes - Ihuayllo',
        'Apurímac - Aymaraes - Justo Apu Sahuaraura',
        'Apurímac - Aymaraes - Lucre',
        'Apurímac - Aymaraes - Pocohuanca',
        'Apurímac - Aymaraes - San Juan de Chacña',
        'Apurímac - Aymaraes - Sañayca',
        'Apurímac - Aymaraes - Soraya',
        'Apurímac - Aymaraes - Tapairihua',
        'Apurímac - Aymaraes - Tintay',
        'Apurímac - Aymaraes - Toraya',
        'Apurímac - Aymaraes - Yanaca',
        'Apurímac - Chincheros - Anco_Huallo',
        'Apurímac - Chincheros - Chincheros',
        'Apurímac - Chincheros - Cocharcas',
        'Apurímac - Chincheros - El Porvenir',
        'Apurímac - Chincheros - Huaccana',
        'Apurímac - Chincheros - Los Chankas',
        'Apurímac - Chincheros - Ocobamba',
        'Apurímac - Chincheros - Ongoy',
        'Apurímac - Chincheros - Ranracancha',
        'Apurímac - Chincheros - Rocchacc',
        'Apurímac - Chincheros - Uranmarca',
        'Apurímac - Cotabambas - Challhuahuacho',
        'Apurímac - Cotabambas - Cotabambas',
        'Apurímac - Cotabambas - Coyllurqui',
        'Apurímac - Cotabambas - Haquira',
        'Apurímac - Cotabambas - Mara',
        'Apurímac - Cotabambas - Tambobamba',
        'Apurímac - Grau - Chuquibambilla',
        'Apurímac - Grau - Curasco',
        'Apurímac - Grau - Curpahuasi',
        'Apurímac - Grau - Gamarra',
        'Apurímac - Grau - Huayllati',
        'Apurímac - Grau - Mamara',
        'Apurímac - Grau - Micaela Bastidas',
        'Apurímac - Grau - Pataypampa',
        'Apurímac - Grau - Progreso',
        'Apurímac - Grau - San Antonio',
        'Apurímac - Grau - Santa Rosa',
        'Apurímac - Grau - Turpay',
        'Apurímac - Grau - Vilcabamba',
        'Apurímac - Grau - Virundo',
        'Arequipa - Arequipa - Alto Selva Alegre',
        'Arequipa - Arequipa - Arequipa',
        'Arequipa - Arequipa - Cayma',
        'Arequipa - Arequipa - Cerro Colorado',
        'Arequipa - Arequipa - Characato',
        'Arequipa - Arequipa - Chiguata',
        'Arequipa - Arequipa - Jacobo Hunter',
        'Arequipa - Arequipa - José Luis Bustamante Y Rivero',
        'Arequipa - Arequipa - La Joya',
        'Arequipa - Arequipa - Mariano Melgar',
        'Arequipa - Arequipa - Miraflores',
        'Arequipa - Arequipa - Mollebaya',
        'Arequipa - Arequipa - Paucarpata',
        'Arequipa - Arequipa - Pocsi',
        'Arequipa - Arequipa - Polobaya',
        'Arequipa - Arequipa - Quequeña',
        'Arequipa - Arequipa - Sabandia',
        'Arequipa - Arequipa - Sachaca',
        'Arequipa - Arequipa - San Juan de Siguas',
        'Arequipa - Arequipa - San Juan de Tarucani',
        'Arequipa - Arequipa - Santa Isabel de Siguas',
        'Arequipa - Arequipa - Santa Rita de Siguas',
        'Arequipa - Arequipa - Socabaya',
        'Arequipa - Arequipa - Tiabaya',
        'Arequipa - Arequipa - Uchumayo',
        'Arequipa - Arequipa - Vitor',
        'Arequipa - Arequipa - Yanahuara',
        'Arequipa - Arequipa - Yarabamba',
        'Arequipa - Arequipa - Yura',
        'Arequipa - Camaná - Camaná',
        'Arequipa - Camaná - José María Quimper',
        'Arequipa - Camaná - Mariano Nicolás Valcárcel',
        'Arequipa - Camaná - Mariscal Cáceres',
        'Arequipa - Camaná - Nicolás de Pierola',
        'Arequipa - Camaná - Ocoña',
        'Arequipa - Camaná - Quilca',
        'Arequipa - Camaná - Samuel Pastor',
        'Arequipa - Caravelí - Acarí',
        'Arequipa - Caravelí - Atico',
        'Arequipa - Caravelí - Atiquipa',
        'Arequipa - Caravelí - Bella Unión',
        'Arequipa - Caravelí - Cahuacho',
        'Arequipa - Caravelí - Caravelí',
        'Arequipa - Caravelí - Chala',
        'Arequipa - Caravelí - Chaparra',
        'Arequipa - Caravelí - Huanuhuanu',
        'Arequipa - Caravelí - Jaqui',
        'Arequipa - Caravelí - Lomas',
        'Arequipa - Caravelí - Quicacha',
        'Arequipa - Caravelí - Yauca',
        'Arequipa - Castilla - Andagua',
        'Arequipa - Castilla - Aplao',
        'Arequipa - Castilla - Ayo',
        'Arequipa - Castilla - Chachas',
        'Arequipa - Castilla - Chilcaymarca',
        'Arequipa - Castilla - Choco',
        'Arequipa - Castilla - Huancarqui',
        'Arequipa - Castilla - Machaguay',
        'Arequipa - Castilla - Orcopampa',
        'Arequipa - Castilla - Pampacolca',
        'Arequipa - Castilla - Tipan',
        'Arequipa - Castilla - Uñon',
        'Arequipa - Castilla - Uraca',
        'Arequipa - Castilla - Viraco',
        'Arequipa - Caylloma - Achoma',
        'Arequipa - Caylloma - Cabanaconde',
        'Arequipa - Caylloma - Callalli',
        'Arequipa - Caylloma - Caylloma',
        'Arequipa - Caylloma - Chivay',
        'Arequipa - Caylloma - Coporaque',
        'Arequipa - Caylloma - Huambo',
        'Arequipa - Caylloma - Huanca',
        'Arequipa - Caylloma - Ichupampa',
        'Arequipa - Caylloma - Lari',
        'Arequipa - Caylloma - Lluta',
        'Arequipa - Caylloma - Maca',
        'Arequipa - Caylloma - Madrigal',
        'Arequipa - Caylloma - Majes',
        'Arequipa - Caylloma - San Antonio de Chuca',
        'Arequipa - Caylloma - Sibayo',
        'Arequipa - Caylloma - Tapay',
        'Arequipa - Caylloma - Tisco',
        'Arequipa - Caylloma - Tuti',
        'Arequipa - Caylloma - Yanque',
        'Arequipa - Condesuyos - Andaray',
        'Arequipa - Condesuyos - Cayarani',
        'Arequipa - Condesuyos - Chichas',
        'Arequipa - Condesuyos - Chuquibamba',
        'Arequipa - Condesuyos - Iray',
        'Arequipa - Condesuyos - Río Grande',
        'Arequipa - Condesuyos - Salamanca',
        'Arequipa - Condesuyos - Yanaquihua',
        'Arequipa - Islay - Cocachacra',
        'Arequipa - Islay - Dean Valdivia',
        'Arequipa - Islay - Islay',
        'Arequipa - Islay - Mejia',
        'Arequipa - Islay - Mollendo',
        'Arequipa - Islay - Punta de Bombón',
        'Arequipa - La Uniòn - Alca',
        'Arequipa - La Uniòn - Charcana',
        'Arequipa - La Uniòn - Cotahuasi',
        'Arequipa - La Uniòn - Huaynacotas',
        'Arequipa - La Uniòn - Pampamarca',
        'Arequipa - La Uniòn - Puyca',
        'Arequipa - La Uniòn - Quechualla',
        'Arequipa - La Uniòn - Sayla',
        'Arequipa - La Uniòn - Tauria',
        'Arequipa - La Uniòn - Tomepampa',
        'Arequipa - La Uniòn - Toro',
        'Ayacucho - Cangallo - Cangallo',
        'Ayacucho - Cangallo - Chuschi',
        'Ayacucho - Cangallo - Los Morochucos',
        'Ayacucho - Cangallo - María Parado de Bellido',
        'Ayacucho - Cangallo - Paras',
        'Ayacucho - Cangallo - Totos',
        'Ayacucho - Huamanga - Acocro',
        'Ayacucho - Huamanga - Acos Vinchos',
        'Ayacucho - Huamanga - Andrés Avelino Cáceres Dorregaray',
        'Ayacucho - Huamanga - Ayacucho',
        'Ayacucho - Huamanga - Carmen Alto',
        'Ayacucho - Huamanga - Chiara',
        'Ayacucho - Huamanga - Jesús Nazareno',
        'Ayacucho - Huamanga - Ocros',
        'Ayacucho - Huamanga - Pacaycasa',
        'Ayacucho - Huamanga - Quinua',
        'Ayacucho - Huamanga - San José de Ticllas',
        'Ayacucho - Huamanga - San Juan Bautista',
        'Ayacucho - Huamanga - Santiago de Pischa',
        'Ayacucho - Huamanga - Socos',
        'Ayacucho - Huamanga - Tambillo',
        'Ayacucho - Huamanga - Vinchos',
        'Ayacucho - Huanca Sancos - Carapo',
        'Ayacucho - Huanca Sancos - Sacsamarca',
        'Ayacucho - Huanca Sancos - Sancos',
        'Ayacucho - Huanca Sancos - Santiago de Lucanamarca',
        'Ayacucho - Huanta - Ayahuanco',
        'Ayacucho - Huanta - Canayre',
        'Ayacucho - Huanta - Chaca',
        'Ayacucho - Huanta - Huamanguilla',
        'Ayacucho - Huanta - Huanta',
        'Ayacucho - Huanta - Iguain',
        'Ayacucho - Huanta - Llochegua',
        'Ayacucho - Huanta - Luricocha',
        'Ayacucho - Huanta - Pucacolpa',
        'Ayacucho - Huanta - Santillana',
        'Ayacucho - Huanta - Sivia',
        'Ayacucho - Huanta - Uchuraccay',
        'Ayacucho - La Mar - Anchihuay',
        'Ayacucho - La Mar - Anco',
        'Ayacucho - La Mar - Ayna',
        'Ayacucho - La Mar - Chilcas',
        'Ayacucho - La Mar - Chungui',
        'Ayacucho - La Mar - Luis Carranza',
        'Ayacucho - La Mar - Oronccoy',
        'Ayacucho - La Mar - Samugari',
        'Ayacucho - La Mar - San Miguel',
        'Ayacucho - La Mar - Santa Rosa',
        'Ayacucho - La Mar - Tambo',
        'Ayacucho - Lucanas - Aucara',
        'Ayacucho - Lucanas - Cabana',
        'Ayacucho - Lucanas - Carmen Salcedo',
        'Ayacucho - Lucanas - Chaviña',
        'Ayacucho - Lucanas - Chipao',
        'Ayacucho - Lucanas - Huac-Huas',
        'Ayacucho - Lucanas - Laramate',
        'Ayacucho - Lucanas - Leoncio Prado',
        'Ayacucho - Lucanas - Llauta',
        'Ayacucho - Lucanas - Lucanas',
        'Ayacucho - Lucanas - Ocaña',
        'Ayacucho - Lucanas - Otoca',
        'Ayacucho - Lucanas - Puquio',
        'Ayacucho - Lucanas - Saisa',
        'Ayacucho - Lucanas - San Cristóbal',
        'Ayacucho - Lucanas - San Juan',
        'Ayacucho - Lucanas - San Pedro',
        'Ayacucho - Lucanas - San Pedro de Palco',
        'Ayacucho - Lucanas - Sancos',
        'Ayacucho - Lucanas - Santa Ana de Huaycahuacho',
        'Ayacucho - Lucanas - Santa Lucia',
        'Ayacucho - Parinacochas - Chumpi',
        'Ayacucho - Parinacochas - Coracora',
        'Ayacucho - Parinacochas - Coronel Castañeda',
        'Ayacucho - Parinacochas - Pacapausa',
        'Ayacucho - Parinacochas - Pullo',
        'Ayacucho - Parinacochas - Puyusca',
        'Ayacucho - Parinacochas - San Francisco de Ravacayco',
        'Ayacucho - Parinacochas - Upahuacho',
        'Ayacucho - Pàucar del Sara Sara - Colta',
        'Ayacucho - Pàucar del Sara Sara - Corculla',
        'Ayacucho - Pàucar del Sara Sara - Lampa',
        'Ayacucho - Pàucar del Sara Sara - Marcabamba',
        'Ayacucho - Pàucar del Sara Sara - Oyolo',
        'Ayacucho - Pàucar del Sara Sara - Pararca',
        'Ayacucho - Pàucar del Sara Sara - Pausa',
        'Ayacucho - Pàucar del Sara Sara - San Javier de Alpabamba',
        'Ayacucho - Pàucar del Sara Sara - San José de Ushua',
        'Ayacucho - Pàucar del Sara Sara - Sara Sara',
        'Ayacucho - Sucre - Belén',
        'Ayacucho - Sucre - Chalcos',
        'Ayacucho - Sucre - Chilcayoc',
        'Ayacucho - Sucre - Huacaña',
        'Ayacucho - Sucre - Morcolla',
        'Ayacucho - Sucre - Paico',
        'Ayacucho - Sucre - Querobamba',
        'Ayacucho - Sucre - San Pedro de Larcay',
        'Ayacucho - Sucre - San Salvador de Quije',
        'Ayacucho - Sucre - Santiago de Paucaray',
        'Ayacucho - Sucre - Soras',
        'Ayacucho - Víctor Fajardo - Alcamenca',
        'Ayacucho - Víctor Fajardo - Apongo',
        'Ayacucho - Víctor Fajardo - Asquipata',
        'Ayacucho - Víctor Fajardo - Canaria',
        'Ayacucho - Víctor Fajardo - Cayara',
        'Ayacucho - Víctor Fajardo - Colca',
        'Ayacucho - Víctor Fajardo - Hualla',
        'Ayacucho - Víctor Fajardo - Huamanquiquia',
        'Ayacucho - Víctor Fajardo - Huancapi',
        'Ayacucho - Víctor Fajardo - Huancaraylla',
        'Ayacucho - Víctor Fajardo - Sarhua',
        'Ayacucho - Víctor Fajardo - Vilcanchos',
        'Ayacucho - Vilcas Huamán - Accomarca',
        'Ayacucho - Vilcas Huamán - Carhuanca',
        'Ayacucho - Vilcas Huamán - Concepción',
        'Ayacucho - Vilcas Huamán - Huambalpa',
        'Ayacucho - Vilcas Huamán - Independencia',
        'Ayacucho - Vilcas Huamán - Saurama',
        'Ayacucho - Vilcas Huamán - Vilcas Huaman',
        'Ayacucho - Vilcas Huamán - Vischongo',
        'Cajamarca - Cajabamba - Cachachi',
        'Cajamarca - Cajabamba - Cajabamba',
        'Cajamarca - Cajabamba - Condebamba',
        'Cajamarca - Cajabamba - Sitacocha',
        'Cajamarca - Cajamarca - Asunción',
        'Cajamarca - Cajamarca - Cajamarca',
        'Cajamarca - Cajamarca - Chetilla',
        'Cajamarca - Cajamarca - Cospan',
        'Cajamarca - Cajamarca - Encañada',
        'Cajamarca - Cajamarca - Jesús',
        'Cajamarca - Cajamarca - Llacanora',
        'Cajamarca - Cajamarca - Los Baños del Inca',
        'Cajamarca - Cajamarca - Magdalena',
        'Cajamarca - Cajamarca - Matara',
        'Cajamarca - Cajamarca - Namora',
        'Cajamarca - Cajamarca - San Juan',
        'Cajamarca - Celendín - Celendín',
        'Cajamarca - Celendín - Chumuch',
        'Cajamarca - Celendín - Cortegana',
        'Cajamarca - Celendín - Huasmin',
        'Cajamarca - Celendín - Jorge Chávez',
        'Cajamarca - Celendín - José Gálvez',
        'Cajamarca - Celendín - La Libertad de Pallan',
        'Cajamarca - Celendín - Miguel Iglesias',
        'Cajamarca - Celendín - Oxamarca',
        'Cajamarca - Celendín - Sorochuco',
        'Cajamarca - Celendín - Sucre',
        'Cajamarca - Celendín - Utco',
        'Cajamarca - Chota - Anguia',
        'Cajamarca - Chota - Chadin',
        'Cajamarca - Chota - Chalamarca',
        'Cajamarca - Chota - Chiguirip',
        'Cajamarca - Chota - Chimban',
        'Cajamarca - Chota - Choropampa',
        'Cajamarca - Chota - Chota',
        'Cajamarca - Chota - Cochabamba',
        'Cajamarca - Chota - Conchan',
        'Cajamarca - Chota - Huambos',
        'Cajamarca - Chota - Lajas',
        'Cajamarca - Chota - Llama',
        'Cajamarca - Chota - Miracosta',
        'Cajamarca - Chota - Paccha',
        'Cajamarca - Chota - Pion',
        'Cajamarca - Chota - Querocoto',
        'Cajamarca - Chota - San Juan de Licupis',
        'Cajamarca - Chota - Tacabamba',
        'Cajamarca - Chota - Tocmoche',
        'Cajamarca - Contumazá - Chilete',
        'Cajamarca - Contumazá - Contumaza',
        'Cajamarca - Contumazá - Cupisnique',
        'Cajamarca - Contumazá - Guzmango',
        'Cajamarca - Contumazá - San Benito',
        'Cajamarca - Contumazá - Santa Cruz de Toledo',
        'Cajamarca - Contumazá - Tantarica',
        'Cajamarca - Contumazá - Yonan',
        'Cajamarca - Cutervo - Callayuc',
        'Cajamarca - Cutervo - Choros',
        'Cajamarca - Cutervo - Cujillo',
        'Cajamarca - Cutervo - Cutervo',
        'Cajamarca - Cutervo - La Ramada',
        'Cajamarca - Cutervo - Pimpingos',
        'Cajamarca - Cutervo - Querocotillo',
        'Cajamarca - Cutervo - San Andrés de Cutervo',
        'Cajamarca - Cutervo - San Juan de Cutervo',
        'Cajamarca - Cutervo - San Luis de Lucma',
        'Cajamarca - Cutervo - Santa Cruz',
        'Cajamarca - Cutervo - Santo Domingo de la Capilla',
        'Cajamarca - Cutervo - Santo Tomas',
        'Cajamarca - Cutervo - Socota',
        'Cajamarca - Cutervo - Toribio Casanova',
        'Cajamarca - Hualgayoc - Bambamarca',
        'Cajamarca - Hualgayoc - Chugur',
        'Cajamarca - Hualgayoc - Hualgayoc',
        'Cajamarca - Jaén - Bellavista',
        'Cajamarca - Jaén - Chontali',
        'Cajamarca - Jaén - Colasay',
        'Cajamarca - Jaén - Huabal',
        'Cajamarca - Jaén - Jaén',
        'Cajamarca - Jaén - Las Pirias',
        'Cajamarca - Jaén - Pomahuaca',
        'Cajamarca - Jaén - Pucara',
        'Cajamarca - Jaén - Sallique',
        'Cajamarca - Jaén - San Felipe',
        'Cajamarca - Jaén - San José del Alto',
        'Cajamarca - Jaén - Santa Rosa',
        'Cajamarca - San Ignacio - Chirinos',
        'Cajamarca - San Ignacio - Huarango',
        'Cajamarca - San Ignacio - La Coipa',
        'Cajamarca - San Ignacio - Namballe',
        'Cajamarca - San Ignacio - San Ignacio',
        'Cajamarca - San Ignacio - San José de Lourdes',
        'Cajamarca - San Ignacio - Tabaconas',
        'Cajamarca - San Marcos - Chancay',
        'Cajamarca - San Marcos - Eduardo Villanueva',
        'Cajamarca - San Marcos - Gregorio Pita',
        'Cajamarca - San Marcos - Ichocan',
        'Cajamarca - San Marcos - José Manuel Quiroz',
        'Cajamarca - San Marcos - José Sabogal',
        'Cajamarca - San Marcos - Pedro Gálvez',
        'Cajamarca - San Miguel - Bolívar',
        'Cajamarca - San Miguel - Calquis',
        'Cajamarca - San Miguel - Catilluc',
        'Cajamarca - San Miguel - El Prado',
        'Cajamarca - San Miguel - La Florida',
        'Cajamarca - San Miguel - Llapa',
        'Cajamarca - San Miguel - Nanchoc',
        'Cajamarca - San Miguel - Niepos',
        'Cajamarca - San Miguel - San Gregorio',
        'Cajamarca - San Miguel - San Miguel',
        'Cajamarca - San Miguel - San Silvestre de Cochan',
        'Cajamarca - San Miguel - Tongod',
        'Cajamarca - San Miguel - Unión Agua Blanca',
        'Cajamarca - San Pablo - San Bernardino',
        'Cajamarca - San Pablo - San Luis',
        'Cajamarca - San Pablo - San Pablo',
        'Cajamarca - San Pablo - Tumbaden',
        'Cajamarca - Santa Cruz - Andabamba',
        'Cajamarca - Santa Cruz - Catache',
        'Cajamarca - Santa Cruz - Chancaybaños',
        'Cajamarca - Santa Cruz - La Esperanza',
        'Cajamarca - Santa Cruz - Ninabamba',
        'Cajamarca - Santa Cruz - Pulan',
        'Cajamarca - Santa Cruz - Santa Cruz',
        'Cajamarca - Santa Cruz - Saucepampa',
        'Cajamarca - Santa Cruz - Sexi',
        'Cajamarca - Santa Cruz - Uticyacu',
        'Cajamarca - Santa Cruz - Yauyucan',
        'Callao - Prov. Const. del Callao - Bellavista',
        'Callao - Prov. Const. del Callao - Callao',
        'Callao - Prov. Const. del Callao - Carmen de la Legua Reynoso',
        'Callao - Prov. Const. del Callao - La Perla',
        'Callao - Prov. Const. del Callao - La Punta',
        'Callao - Prov. Const. del Callao - Mi Perú',
        'Callao - Prov. Const. del Callao - Ventanilla',
        'Cusco - Acomayo - Acomayo',
        'Cusco - Acomayo - Acopia',
        'Cusco - Acomayo - Acos',
        'Cusco - Acomayo - Mosoc Llacta',
        'Cusco - Acomayo - Pomacanchi',
        'Cusco - Acomayo - Rondocan',
        'Cusco - Acomayo - Sangarara',
        'Cusco - Anta - Ancahuasi',
        'Cusco - Anta - Anta',
        'Cusco - Anta - Cachimayo',
        'Cusco - Anta - Chinchaypujio',
        'Cusco - Anta - Huarocondo',
        'Cusco - Anta - Limatambo',
        'Cusco - Anta - Mollepata',
        'Cusco - Anta - Pucyura',
        'Cusco - Anta - Zurite',
        'Cusco - Calca - Calca',
        'Cusco - Calca - Coya',
        'Cusco - Calca - Lamay',
        'Cusco - Calca - Lares',
        'Cusco - Calca - Pisac',
        'Cusco - Calca - San Salvador',
        'Cusco - Calca - Taray',
        'Cusco - Calca - Yanatile',
        'Cusco - Canas - Checca',
        'Cusco - Canas - Kunturkanki',
        'Cusco - Canas - Langui',
        'Cusco - Canas - Layo',
        'Cusco - Canas - Pampamarca',
        'Cusco - Canas - Quehue',
        'Cusco - Canas - Tupac Amaru',
        'Cusco - Canas - Yanaoca',
        'Cusco - Canchis - Checacupe',
        'Cusco - Canchis - Combapata',
        'Cusco - Canchis - Marangani',
        'Cusco - Canchis - Pitumarca',
        'Cusco - Canchis - San Pablo',
        'Cusco - Canchis - San Pedro',
        'Cusco - Canchis - Sicuani',
        'Cusco - Canchis - Tinta',
        'Cusco - Chumbivilcas - Capacmarca',
        'Cusco - Chumbivilcas - Chamaca',
        'Cusco - Chumbivilcas - Colquemarca',
        'Cusco - Chumbivilcas - Livitaca',
        'Cusco - Chumbivilcas - Llusco',
        'Cusco - Chumbivilcas - Quiñota',
        'Cusco - Chumbivilcas - Santo Tomas',
        'Cusco - Chumbivilcas - Velille',
        'Cusco - Cusco - Ccorca',
        'Cusco - Cusco - Cusco',
        'Cusco - Cusco - Poroy',
        'Cusco - Cusco - San Jerónimo',
        'Cusco - Cusco - San Sebastian',
        'Cusco - Cusco - Santiago',
        'Cusco - Cusco - Saylla',
        'Cusco - Cusco - Wanchaq',
        'Cusco - Espinar - Alto Pichigua',
        'Cusco - Espinar - Condoroma',
        'Cusco - Espinar - Coporaque',
        'Cusco - Espinar - Espinar',
        'Cusco - Espinar - Ocoruro',
        'Cusco - Espinar - Pallpata',
        'Cusco - Espinar - Pichigua',
        'Cusco - Espinar - Suyckutambo',
        'Cusco - La Convención - Echarate',
        'Cusco - La Convención - Huayopata',
        'Cusco - La Convención - Inkawasi',
        'Cusco - La Convención - Kimbiri',
        'Cusco - La Convención - Maranura',
        'Cusco - La Convención - Megantoni',
        'Cusco - La Convención - Ocobamba',
        'Cusco - La Convención - Pichari',
        'Cusco - La Convención - Quellouno',
        'Cusco - La Convención - Santa Ana',
        'Cusco - La Convención - Santa Teresa',
        'Cusco - La Convención - Vilcabamba',
        'Cusco - La Convención - Villa Kintiarina',
        'Cusco - La Convención - Villa Virgen',
        'Cusco - Paruro - Accha',
        'Cusco - Paruro - Ccapi',
        'Cusco - Paruro - Colcha',
        'Cusco - Paruro - Huanoquite',
        'Cusco - Paruro - Omachaç',
        'Cusco - Paruro - Paccaritambo',
        'Cusco - Paruro - Paruro',
        'Cusco - Paruro - Pillpinto',
        'Cusco - Paruro - Yaurisque',
        'Cusco - Paucartambo - Caicay',
        'Cusco - Paucartambo - Challabamba',
        'Cusco - Paucartambo - Colquepata',
        'Cusco - Paucartambo - Huancarani',
        'Cusco - Paucartambo - Kosñipata',
        'Cusco - Paucartambo - Paucartambo',
        'Cusco - Quispicanchi - Andahuaylillas',
        'Cusco - Quispicanchi - Camanti',
        'Cusco - Quispicanchi - Ccarhuayo',
        'Cusco - Quispicanchi - Ccatca',
        'Cusco - Quispicanchi - Cusipata',
        'Cusco - Quispicanchi - Huaro',
        'Cusco - Quispicanchi - Lucre',
        'Cusco - Quispicanchi - Marcapata',
        'Cusco - Quispicanchi - Ocongate',
        'Cusco - Quispicanchi - Oropesa',
        'Cusco - Quispicanchi - Quiquijana',
        'Cusco - Quispicanchi - Urcos',
        'Cusco - Urubamba - Chinchero',
        'Cusco - Urubamba - Huayllabamba',
        'Cusco - Urubamba - Machupicchu',
        'Cusco - Urubamba - Maras',
        'Cusco - Urubamba - Ollantaytambo',
        'Cusco - Urubamba - Urubamba',
        'Cusco - Urubamba - Yucay',
        'Huancavelica - Acobamba - Acobamba',
        'Huancavelica - Acobamba - Andabamba',
        'Huancavelica - Acobamba - Anta',
        'Huancavelica - Acobamba - Caja',
        'Huancavelica - Acobamba - Marcas',
        'Huancavelica - Acobamba - Paucara',
        'Huancavelica - Acobamba - Pomacocha',
        'Huancavelica - Acobamba - Rosario',
        'Huancavelica - Angaraes - Anchonga',
        'Huancavelica - Angaraes - Callanmarca',
        'Huancavelica - Angaraes - Ccochaccasa',
        'Huancavelica - Angaraes - Chincho',
        'Huancavelica - Angaraes - Congalla',
        'Huancavelica - Angaraes - Huanca-Huanca',
        'Huancavelica - Angaraes - Huayllay Grande',
        'Huancavelica - Angaraes - Julcamarca',
        'Huancavelica - Angaraes - Lircay',
        'Huancavelica - Angaraes - San Antonio de Antaparco',
        'Huancavelica - Angaraes - Santo Tomas de Pata',
        'Huancavelica - Angaraes - Secclla',
        'Huancavelica - Castrovirreyna - Arma',
        'Huancavelica - Castrovirreyna - Aurahua',
        'Huancavelica - Castrovirreyna - Capillas',
        'Huancavelica - Castrovirreyna - Castrovirreyna',
        'Huancavelica - Castrovirreyna - Chupamarca',
        'Huancavelica - Castrovirreyna - Cocas',
        'Huancavelica - Castrovirreyna - Huachos',
        'Huancavelica - Castrovirreyna - Huamatambo',
        'Huancavelica - Castrovirreyna - Mollepampa',
        'Huancavelica - Castrovirreyna - San Juan',
        'Huancavelica - Castrovirreyna - Santa Ana',
        'Huancavelica - Castrovirreyna - Tantara',
        'Huancavelica - Castrovirreyna - Ticrapo',
        'Huancavelica - Churcampa - Anco',
        'Huancavelica - Churcampa - Chinchihuasi',
        'Huancavelica - Churcampa - Churcampa',
        'Huancavelica - Churcampa - Cosme',
        'Huancavelica - Churcampa - El Carmen',
        'Huancavelica - Churcampa - La Merced',
        'Huancavelica - Churcampa - Locroja',
        'Huancavelica - Churcampa - Pachamarca',
        'Huancavelica - Churcampa - Paucarbamba',
        'Huancavelica - Churcampa - San Miguel de Mayocc',
        'Huancavelica - Churcampa - San Pedro de Coris',
        'Huancavelica - Huancavelica - Acobambilla',
        'Huancavelica - Huancavelica - Acoria',
        'Huancavelica - Huancavelica - Ascensión',
        'Huancavelica - Huancavelica - Conayca',
        'Huancavelica - Huancavelica - Cuenca',
        'Huancavelica - Huancavelica - Huachocolpa',
        'Huancavelica - Huancavelica - Huancavelica',
        'Huancavelica - Huancavelica - Huando',
        'Huancavelica - Huancavelica - Huayllahuara',
        'Huancavelica - Huancavelica - Izcuchaca',
        'Huancavelica - Huancavelica - Laria',
        'Huancavelica - Huancavelica - Manta',
        'Huancavelica - Huancavelica - Mariscal Cáceres',
        'Huancavelica - Huancavelica - Moya',
        'Huancavelica - Huancavelica - Nuevo Occoro',
        'Huancavelica - Huancavelica - Palca',
        'Huancavelica - Huancavelica - Pilchaca',
        'Huancavelica - Huancavelica - Vilca',
        'Huancavelica - Huancavelica - Yauli',
        'Huancavelica - Huaytará - Ayavi',
        'Huancavelica - Huaytará - Córdova',
        'Huancavelica - Huaytará - Huayacundo Arma',
        'Huancavelica - Huaytará - Huaytara',
        'Huancavelica - Huaytará - Laramarca',
        'Huancavelica - Huaytará - Ocoyo',
        'Huancavelica - Huaytará - Pilpichaca',
        'Huancavelica - Huaytará - Querco',
        'Huancavelica - Huaytará - Quito-Arma',
        'Huancavelica - Huaytará - San Antonio de Cusicancha',
        'Huancavelica - Huaytará - San Francisco de Sangayaico',
        'Huancavelica - Huaytará - San Isidro',
        'Huancavelica - Huaytará - Santiago de Chocorvos',
        'Huancavelica - Huaytará - Santiago de Quirahuara',
        'Huancavelica - Huaytará - Santo Domingo de Capillas',
        'Huancavelica - Huaytará - Tambo',
        'Huancavelica - Tayacaja - Acostambo',
        'Huancavelica - Tayacaja - Acraquia',
        'Huancavelica - Tayacaja - Ahuaycha',
        'Huancavelica - Tayacaja - Andaymarca',
        'Huancavelica - Tayacaja - Colcabamba',
        'Huancavelica - Tayacaja - Daniel Hernández',
        'Huancavelica - Tayacaja - Huachocolpa',
        'Huancavelica - Tayacaja - Huaribamba',
        'Huancavelica - Tayacaja - Ñahuimpuquio',
        'Huancavelica - Tayacaja - Pampas',
        'Huancavelica - Tayacaja - Pazos',
        'Huancavelica - Tayacaja - Pichos',
        'Huancavelica - Tayacaja - Quichuas',
        'Huancavelica - Tayacaja - Quishuar',
        'Huancavelica - Tayacaja - Roble',
        'Huancavelica - Tayacaja - Salcabamba',
        'Huancavelica - Tayacaja - Salcahuasi',
        'Huancavelica - Tayacaja - San Marcos de Rocchac',
        'Huancavelica - Tayacaja - Santiago de Tucuma',
        'Huancavelica - Tayacaja - Surcubamba',
        'Huancavelica - Tayacaja - Tintay Puncu',
        'Huánuco - Ambo - Ambo',
        'Huánuco - Ambo - Cayna',
        'Huánuco - Ambo - Colpas',
        'Huánuco - Ambo - Conchamarca',
        'Huánuco - Ambo - Huacar',
        'Huánuco - Ambo - San Francisco',
        'Huánuco - Ambo - San Rafael',
        'Huánuco - Ambo - Tomay Kichwa',
        'Huánuco - Dos de Mayo - Chuquis',
        'Huánuco - Dos de Mayo - La Unión',
        'Huánuco - Dos de Mayo - Marías',
        'Huánuco - Dos de Mayo - Pachas',
        'Huánuco - Dos de Mayo - Quivilla',
        'Huánuco - Dos de Mayo - Ripan',
        'Huánuco - Dos de Mayo - Shunqui',
        'Huánuco - Dos de Mayo - Sillapata',
        'Huánuco - Dos de Mayo - Yanas',
        'Huánuco - Huacaybamba - Canchabamba',
        'Huánuco - Huacaybamba - Cochabamba',
        'Huánuco - Huacaybamba - Huacaybamba',
        'Huánuco - Huacaybamba - Pinra',
        'Huánuco - Huamalíes - Arancay',
        'Huánuco - Huamalíes - Chavín de Pariarca',
        'Huánuco - Huamalíes - Jacas Grande',
        'Huánuco - Huamalíes - Jircan',
        'Huánuco - Huamalíes - Llata',
        'Huánuco - Huamalíes - Miraflores',
        'Huánuco - Huamalíes - Monzón',
        'Huánuco - Huamalíes - Punchao',
        'Huánuco - Huamalíes - Puños',
        'Huánuco - Huamalíes - Singa',
        'Huánuco - Huamalíes - Tantamayo',
        'Huánuco - Huánuco - Amarilis',
        'Huánuco - Huánuco - Chinchao',
        'Huánuco - Huánuco - Churubamba',
        'Huánuco - Huánuco - Huanuco',
        'Huánuco - Huánuco - Margos',
        'Huánuco - Huánuco - Pillco Marca',
        'Huánuco - Huánuco - Quisqui (Kichki)',
        'Huánuco - Huánuco - San Francisco de Cayran',
        'Huánuco - Huánuco - San Pablo de Pillao',
        'Huánuco - Huánuco - San Pedro de Chaulan',
        'Huánuco - Huánuco - Santa María del Valle',
        'Huánuco - Huánuco - Yacus',
        'Huánuco - Huánuco - Yarumayo',
        'Huánuco - Lauricocha - Baños',
        'Huánuco - Lauricocha - Jesús',
        'Huánuco - Lauricocha - Jivia',
        'Huánuco - Lauricocha - Queropalca',
        'Huánuco - Lauricocha - Rondos',
        'Huánuco - Lauricocha - San Francisco de Asís',
        'Huánuco - Lauricocha - San Miguel de Cauri',
        'Huánuco - Leoncio Prado - Aucayacu (Jose Crespo y Castillo)',
        'Huánuco - Leoncio Prado - Castillo Grande',
        'Huánuco - Leoncio Prado - Daniel Alomía Robles',
        'Huánuco - Leoncio Prado - Hermílio Valdizan',
        'Huánuco - Leoncio Prado - Luyando',
        'Huánuco - Leoncio Prado - Mariano Damaso Beraun',
        'Huánuco - Leoncio Prado - Pucayacu',
        'Huánuco - Leoncio Prado - Pueblo Nuevo',
        'Huánuco - Leoncio Prado - Rupa-Rupa',
        'Huánuco - Leoncio Prado - Santo Domingo de Anda',
        'Huánuco - Marañón - Cholon',
        'Huánuco - Marañón - Huacrachuco',
        'Huánuco - Marañón - La Morada',
        'Huánuco - Marañón - San Buenaventura',
        'Huánuco - Marañón - Santa Rosa de Alto Yanajanca',
        'Huánuco - Pachitea - Chaglla',
        'Huánuco - Pachitea - Molino',
        'Huánuco - Pachitea - Panao',
        'Huánuco - Pachitea - Umari',
        'Huánuco - Puerto Inca - Codo del Pozuzo',
        'Huánuco - Puerto Inca - Honoria',
        'Huánuco - Puerto Inca - Puerto Inca',
        'Huánuco - Puerto Inca - Tournavista',
        'Huánuco - Puerto Inca - Yuyapichis',
        'Huánuco - Yarowilca - Aparicio Pomares',
        'Huánuco - Yarowilca - Cahuac',
        'Huánuco - Yarowilca - Chacabamba',
        'Huánuco - Yarowilca - Chavinillo',
        'Huánuco - Yarowilca - Choras',
        'Huánuco - Yarowilca - Jacas Chico',
        'Huánuco - Yarowilca - Obas',
        'Huánuco - Yarowilca - Pampamarca',
        'Ica - Chincha - Alto Laran',
        'Ica - Chincha - Chavin',
        'Ica - Chincha - Chincha Alta',
        'Ica - Chincha - Chincha Baja',
        'Ica - Chincha - El Carmen',
        'Ica - Chincha - Grocio Prado',
        'Ica - Chincha - Pueblo Nuevo',
        'Ica - Chincha - San Juan de Yanac',
        'Ica - Chincha - San Pedro de Huacarpana',
        'Ica - Chincha - Sunampe',
        'Ica - Chincha - Tambo de Mora',
        'Ica - Ica - Ica',
        'Ica - Ica - La Tinguiña',
        'Ica - Ica - Los Aquijes',
        'Ica - Ica - Ocucaje',
        'Ica - Ica - Pachacutec',
        'Ica - Ica - Parcona',
        'Ica - Ica - Pueblo Nuevo',
        'Ica - Ica - Salas',
        'Ica - Ica - San José de Los Molinos',
        'Ica - Ica - San Juan Bautista',
        'Ica - Ica - Santiago',
        'Ica - Ica - Subtanjalla',
        'Ica - Ica - Tate',
        'Ica - Ica - Yauca del Rosario',
        'Ica - Nasca - Changuillo',
        'Ica - Nasca - El Ingenio',
        'Ica - Nasca - Marcona',
        'Ica - Nasca - Nasca',
        'Ica - Nasca - Vista Alegre',
        'Ica - Palpa - Llipata',
        'Ica - Palpa - Palpa',
        'Ica - Palpa - Río Grande',
        'Ica - Palpa - Santa Cruz',
        'Ica - Palpa - Tibillo',
        'Ica - Pisco - Huancano',
        'Ica - Pisco - Humay',
        'Ica - Pisco - Independencia',
        'Ica - Pisco - Paracas',
        'Ica - Pisco - Pisco',
        'Ica - Pisco - San Andrés',
        'Ica - Pisco - San Clemente',
        'Ica - Pisco - Tupac Amaru Inca',
        'Junín - Chanchamayo - Chanchamayo',
        'Junín - Chanchamayo - Perene',
        'Junín - Chanchamayo - Pichanaqui',
        'Junín - Chanchamayo - San Luis de Shuaro',
        'Junín - Chanchamayo - San Ramón',
        'Junín - Chanchamayo - Vitoc',
        'Junín - Chupaca - Ahuac',
        'Junín - Chupaca - Chongos Bajo',
        'Junín - Chupaca - Chupaca',
        'Junín - Chupaca - Huachac',
        'Junín - Chupaca - Huamancaca Chico',
        'Junín - Chupaca - San Juan de Iscos',
        'Junín - Chupaca - San Juan de Jarpa',
        'Junín - Chupaca - Tres de Diciembre',
        'Junín - Chupaca - Yanacancha',
        'Junín - Concepción - Aco',
        'Junín - Concepción - Andamarca',
        'Junín - Concepción - Chambara',
        'Junín - Concepción - Cochas',
        'Junín - Concepción - Comas',
        'Junín - Concepción - Concepción',
        'Junín - Concepción - Heroínas Toledo',
        'Junín - Concepción - Manzanares',
        'Junín - Concepción - Mariscal Castilla',
        'Junín - Concepción - Matahuasi',
        'Junín - Concepción - Mito',
        'Junín - Concepción - Nueve de Julio',
        'Junín - Concepción - Orcotuna',
        'Junín - Concepción - San José de Quero',
        'Junín - Concepción - Santa Rosa de Ocopa',
        'Junín - Huancayo - Carhuacallanga',
        'Junín - Huancayo - Chacapampa',
        'Junín - Huancayo - Chicche',
        'Junín - Huancayo - Chilca',
        'Junín - Huancayo - Chongos Alto',
        'Junín - Huancayo - Chupuro',
        'Junín - Huancayo - Colca',
        'Junín - Huancayo - Cullhuas',
        'Junín - Huancayo - El Tambo',
        'Junín - Huancayo - Huacrapuquio',
        'Junín - Huancayo - Hualhuas',
        'Junín - Huancayo - Huancan',
        'Junín - Huancayo - Huancayo',
        'Junín - Huancayo - Huasicancha',
        'Junín - Huancayo - Huayucachi',
        'Junín - Huancayo - Ingenio',
        'Junín - Huancayo - Pariahuanca',
        'Junín - Huancayo - Pilcomayo',
        'Junín - Huancayo - Pucara',
        'Junín - Huancayo - Quichuay',
        'Junín - Huancayo - Quilcas',
        'Junín - Huancayo - San Agustín',
        'Junín - Huancayo - San Jerónimo de Tunan',
        'Junín - Huancayo - Santo Domingo de Acobamba',
        'Junín - Huancayo - Saño',
        'Junín - Huancayo - Sapallanga',
        'Junín - Huancayo - Sicaya',
        'Junín - Huancayo - Viques',
        'Junín - Jauja - Acolla',
        'Junín - Jauja - Apata',
        'Junín - Jauja - Ataura',
        'Junín - Jauja - Canchayllo',
        'Junín - Jauja - Curicaca',
        'Junín - Jauja - El Mantaro',
        'Junín - Jauja - Huamali',
        'Junín - Jauja - Huaripampa',
        'Junín - Jauja - Huertas',
        'Junín - Jauja - Janjaillo',
        'Junín - Jauja - Jauja',
        'Junín - Jauja - Julcán',
        'Junín - Jauja - Leonor Ordóñez',
        'Junín - Jauja - Llocllapampa',
        'Junín - Jauja - Marco',
        'Junín - Jauja - Masma',
        'Junín - Jauja - Masma Chicche',
        'Junín - Jauja - Molinos',
        'Junín - Jauja - Monobamba',
        'Junín - Jauja - Muqui',
        'Junín - Jauja - Muquiyauyo',
        'Junín - Jauja - Paca',
        'Junín - Jauja - Paccha',
        'Junín - Jauja - Pancan',
        'Junín - Jauja - Parco',
        'Junín - Jauja - Pomacancha',
        'Junín - Jauja - Ricran',
        'Junín - Jauja - San Lorenzo',
        'Junín - Jauja - San Pedro de Chunan',
        'Junín - Jauja - Sausa',
        'Junín - Jauja - Sincos',
        'Junín - Jauja - Tunan Marca',
        'Junín - Jauja - Yauli',
        'Junín - Jauja - Yauyos',
        'Junín - Junín - Carhuamayo',
        'Junín - Junín - Junin',
        'Junín - Junín - Ondores',
        'Junín - Junín - Ulcumayo',
        'Junín - Satipo - Coviriali',
        'Junín - Satipo - Llaylla',
        'Junín - Satipo - Mazamari',
        'Junín - Satipo - Pampa Hermosa',
        'Junín - Satipo - Pangoa',
        'Junín - Satipo - Río Negro',
        'Junín - Satipo - Río Tambo',
        'Junín - Satipo - Satipo',
        'Junín - Satipo - Vizcatan del Ene',
        'Junín - Tarma - Acobamba',
        'Junín - Tarma - Huaricolca',
        'Junín - Tarma - Huasahuasi',
        'Junín - Tarma - La Unión',
        'Junín - Tarma - Palca',
        'Junín - Tarma - Palcamayo',
        'Junín - Tarma - San Pedro de Cajas',
        'Junín - Tarma - Tapo',
        'Junín - Tarma - Tarma',
        'Junín - Yauli - Chacapalpa',
        'Junín - Yauli - Huay-Huay',
        'Junín - Yauli - La Oroya',
        'Junín - Yauli - Marcapomacocha',
        'Junín - Yauli - Morococha',
        'Junín - Yauli - Paccha',
        'Junín - Yauli - Santa Bárbara de Carhuacayan',
        'Junín - Yauli - Santa Rosa de Sacco',
        'Junín - Yauli - Suitucancha',
        'Junín - Yauli - Yauli',
        'La Libertad - Ascope - Ascope',
        'La Libertad - Ascope - Casa Grande',
        'La Libertad - Ascope - Chicama',
        'La Libertad - Ascope - Chocope',
        'La Libertad - Ascope - Magdalena de Cao',
        'La Libertad - Ascope - Paijan',
        'La Libertad - Ascope - Rázuri',
        'La Libertad - Ascope - Santiago de Cao',
        'La Libertad - Bolívar - Bambamarca',
        'La Libertad - Bolívar - Bolívar',
        'La Libertad - Bolívar - Condormarca',
        'La Libertad - Bolívar - Longotea',
        'La Libertad - Bolívar - Uchumarca',
        'La Libertad - Bolívar - Ucuncha',
        'La Libertad - Chepén - Chepen',
        'La Libertad - Chepén - Pacanga',
        'La Libertad - Chepén - Pueblo Nuevo',
        'La Libertad - Gran Chimú - Cascas',
        'La Libertad - Gran Chimú - Lucma',
        'La Libertad - Gran Chimú - Marmot',
        'La Libertad - Gran Chimú - Sayapullo',
        'La Libertad - Julcán - Calamarca',
        'La Libertad - Julcán - Carabamba',
        'La Libertad - Julcán - Huaso',
        'La Libertad - Julcán - Julcan',
        'La Libertad - Otuzco - Agallpampa',
        'La Libertad - Otuzco - Charat',
        'La Libertad - Otuzco - Huaranchal',
        'La Libertad - Otuzco - La Cuesta',
        'La Libertad - Otuzco - Mache',
        'La Libertad - Otuzco - Otuzco',
        'La Libertad - Otuzco - Paranday',
        'La Libertad - Otuzco - Salpo',
        'La Libertad - Otuzco - Sinsicap',
        'La Libertad - Otuzco - Usquil',
        'La Libertad - Pacasmayo - Guadalupe',
        'La Libertad - Pacasmayo - Jequetepeque',
        'La Libertad - Pacasmayo - Pacasmayo',
        'La Libertad - Pacasmayo - San José',
        'La Libertad - Pacasmayo - San Pedro de Lloc',
        'La Libertad - Pataz - Buldibuyo',
        'La Libertad - Pataz - Chillia',
        'La Libertad - Pataz - Huancaspata',
        'La Libertad - Pataz - Huaylillas',
        'La Libertad - Pataz - Huayo',
        'La Libertad - Pataz - Ongon',
        'La Libertad - Pataz - Parcoy',
        'La Libertad - Pataz - Pataz',
        'La Libertad - Pataz - Pias',
        'La Libertad - Pataz - Santiago de Challas',
        'La Libertad - Pataz - Taurija',
        'La Libertad - Pataz - Tayabamba',
        'La Libertad - Pataz - Urpay',
        'La Libertad - Sánchez Carrión - Chugay',
        'La Libertad - Sánchez Carrión - Cochorco',
        'La Libertad - Sánchez Carrión - Curgos',
        'La Libertad - Sánchez Carrión - Huamachuco',
        'La Libertad - Sánchez Carrión - Marcabal',
        'La Libertad - Sánchez Carrión - Sanagoran',
        'La Libertad - Sánchez Carrión - Sarin',
        'La Libertad - Sánchez Carrión - Sartimbamba',
        'La Libertad - Santiago de Chuco - Angasmarca',
        'La Libertad - Santiago de Chuco - Cachicadan',
        'La Libertad - Santiago de Chuco - Mollebamba',
        'La Libertad - Santiago de Chuco - Mollepata',
        'La Libertad - Santiago de Chuco - Quiruvilca',
        'La Libertad - Santiago de Chuco - Santa Cruz de Chuca',
        'La Libertad - Santiago de Chuco - Santiago de Chuco',
        'La Libertad - Santiago de Chuco - Sitabamba',
        'La Libertad - Trujillo - El Porvenir',
        'La Libertad - Trujillo - Florencia de Mora',
        'La Libertad - Trujillo - Huanchaco',
        'La Libertad - Trujillo - La Esperanza',
        'La Libertad - Trujillo - Laredo',
        'La Libertad - Trujillo - Moche',
        'La Libertad - Trujillo - Poroto',
        'La Libertad - Trujillo - Salaverry',
        'La Libertad - Trujillo - Simbal',
        'La Libertad - Trujillo - Trujillo',
        'La Libertad - Trujillo - Victor Larco Herrera',
        'La Libertad - Virú - Chao',
        'La Libertad - Virú - Guadalupito',
        'La Libertad - Virú - Viru',
        'Lambayeque - Chiclayo - Cayalti',
        'Lambayeque - Chiclayo - Chiclayo',
        'Lambayeque - Chiclayo - Chongoyape',
        'Lambayeque - Chiclayo - Eten',
        'Lambayeque - Chiclayo - Eten Puerto',
        'Lambayeque - Chiclayo - José Leonardo Ortiz',
        'Lambayeque - Chiclayo - La Victoria',
        'Lambayeque - Chiclayo - Lagunas',
        'Lambayeque - Chiclayo - Monsefu',
        'Lambayeque - Chiclayo - Nueva Arica',
        'Lambayeque - Chiclayo - Oyotun',
        'Lambayeque - Chiclayo - Patapo',
        'Lambayeque - Chiclayo - Picsi',
        'Lambayeque - Chiclayo - Pimentel',
        'Lambayeque - Chiclayo - Pomalca',
        'Lambayeque - Chiclayo - Pucala',
        'Lambayeque - Chiclayo - Reque',
        'Lambayeque - Chiclayo - Santa Rosa',
        'Lambayeque - Chiclayo - Saña',
        'Lambayeque - Chiclayo - Tuman',
        'Lambayeque - Ferreñafe - Cañaris',
        'Lambayeque - Ferreñafe - Ferreñafe',
        'Lambayeque - Ferreñafe - Incahuasi',
        'Lambayeque - Ferreñafe - Manuel Antonio Mesones Muro',
        'Lambayeque - Ferreñafe - Pitipo',
        'Lambayeque - Ferreñafe - Pueblo Nuevo',
        'Lambayeque - Lambayeque - Chochope',
        'Lambayeque - Lambayeque - Illimo',
        'Lambayeque - Lambayeque - Jayanca',
        'Lambayeque - Lambayeque - Lambayeque',
        'Lambayeque - Lambayeque - Mochumi',
        'Lambayeque - Lambayeque - Morrope',
        'Lambayeque - Lambayeque - Motupe',
        'Lambayeque - Lambayeque - Olmos',
        'Lambayeque - Lambayeque - Pacora',
        'Lambayeque - Lambayeque - Salas',
        'Lambayeque - Lambayeque - San José',
        'Lambayeque - Lambayeque - Tucume',
        'Lima - Barranca - Barranca',
        'Lima - Barranca - Paramonga',
        'Lima - Barranca - Pativilca',
        'Lima - Barranca - Supe',
        'Lima - Barranca - Supe Puerto',
        'Lima - Cajatambo - Cajatambo',
        'Lima - Cajatambo - Copa',
        'Lima - Cajatambo - Gorgor',
        'Lima - Cajatambo - Huancapon',
        'Lima - Cajatambo - Manas',
        'Lima - Canta - Arahuay',
        'Lima - Canta - Canta',
        'Lima - Canta - Huamantanga',
        'Lima - Canta - Huaros',
        'Lima - Canta - Lachaqui',
        'Lima - Canta - San Buenaventura',
        'Lima - Canta - Santa Rosa de Quives',
        'Lima - Cañete - Asia',
        'Lima - Cañete - Calango',
        'Lima - Cañete - Cerro Azul',
        'Lima - Cañete - Chilca',
        'Lima - Cañete - Coayllo',
        'Lima - Cañete - Imperial',
        'Lima - Cañete - Lunahuana',
        'Lima - Cañete - Mala',
        'Lima - Cañete - Nuevo Imperial',
        'Lima - Cañete - Pacaran',
        'Lima - Cañete - Quilmana',
        'Lima - Cañete - San Antonio',
        'Lima - Cañete - San Luis',
        'Lima - Cañete - San Vicente de Cañete',
        'Lima - Cañete - Santa Cruz de Flores',
        'Lima - Cañete - Zúñiga',
        'Lima - Huaral - Atavillos Alto',
        'Lima - Huaral - Atavillos Bajo',
        'Lima - Huaral - Aucallama',
        'Lima - Huaral - Chancay',
        'Lima - Huaral - Huaral',
        'Lima - Huaral - Ihuari',
        'Lima - Huaral - Lampian',
        'Lima - Huaral - Pacaraos',
        'Lima - Huaral - San Miguel de Acos',
        'Lima - Huaral - Santa Cruz de Andamarca',
        'Lima - Huaral - Sumbilca',
        'Lima - Huaral - Veintisiete de Noviembre',
        'Lima - Huarochirí - Antioquia',
        'Lima - Huarochirí - Callahuanca',
        'Lima - Huarochirí - Carampoma',
        'Lima - Huarochirí - Chicla',
        'Lima - Huarochirí - Cuenca',
        'Lima - Huarochirí - Huachupampa',
        'Lima - Huarochirí - Huanza',
        'Lima - Huarochirí - Huarochiri',
        'Lima - Huarochirí - Lahuaytambo',
        'Lima - Huarochirí - Langa',
        'Lima - Huarochirí - Laraos',
        'Lima - Huarochirí - Mariatana',
        'Lima - Huarochirí - Matucana',
        'Lima - Huarochirí - Ricardo Palma',
        'Lima - Huarochirí - San Andrés de Tupicocha',
        'Lima - Huarochirí - San Antonio',
        'Lima - Huarochirí - San Bartolomé',
        'Lima - Huarochirí - San Damian',
        'Lima - Huarochirí - San Juan de Iris',
        'Lima - Huarochirí - San Juan de Tantaranche',
        'Lima - Huarochirí - San Lorenzo de Quinti',
        'Lima - Huarochirí - San Mateo',
        'Lima - Huarochirí - San Mateo de Otao',
        'Lima - Huarochirí - San Pedro de Casta',
        'Lima - Huarochirí - San Pedro de Huancayre',
        'Lima - Huarochirí - Sangallaya',
        'Lima - Huarochirí - Santa Cruz de Cocachacra',
        'Lima - Huarochirí - Santa Eulalia',
        'Lima - Huarochirí - Santiago de Anchucaya',
        'Lima - Huarochirí - Santiago de Tuna',
        'Lima - Huarochirí - Santo Domingo de Los Olleros',
        'Lima - Huarochirí - Surco',
        'Lima - Huaura - Ambar',
        'Lima - Huaura - Caleta de Carquin',
        'Lima - Huaura - Checras',
        'Lima - Huaura - Huacho',
        'Lima - Huaura - Hualmay',
        'Lima - Huaura - Huaura',
        'Lima - Huaura - Leoncio Prado',
        'Lima - Huaura - Paccho',
        'Lima - Huaura - Santa Leonor',
        'Lima - Huaura - Santa María',
        'Lima - Huaura - Sayan',
        'Lima - Huaura - Vegueta',
        'Lima - Lima - Ancón',
        'Lima - Lima - Ate',
        'Lima - Lima - Barranco',
        'Lima - Lima - Breña',
        'Lima - Lima - Carabayllo',
        'Lima - Lima - Chaclacayo',
        'Lima - Lima - Chorrillos',
        'Lima - Lima - Cieneguilla',
        'Lima - Lima - Comas',
        'Lima - Lima - El Agustino',
        'Lima - Lima - Independencia',
        'Lima - Lima - Jesús María',
        'Lima - Lima - La Molina',
        'Lima - Lima - La Victoria',
        'Lima - Lima - Lima',
        'Lima - Lima - Lince',
        'Lima - Lima - Los Olivos',
        'Lima - Lima - Lurigancho (Chosica)',
        'Lima - Lima - Lurin',
        'Lima - Lima - Magdalena del Mar',
        'Lima - Lima - Miraflores',
        'Lima - Lima - Pachacamac',
        'Lima - Lima - Pucusana',
        'Lima - Lima - Pueblo Libre',
        'Lima - Lima - Puente Piedra',
        'Lima - Lima - Punta Hermosa',
        'Lima - Lima - Punta Negra',
        'Lima - Lima - Rímac',
        'Lima - Lima - San Bartolo',
        'Lima - Lima - San Borja',
        'Lima - Lima - San Isidro',
        'Lima - Lima - San Juan de Miraflores',
        'Lima - Lima - San Luis',
        'Lima - Lima - San Martín de Porres',
        'Lima - Lima - San Miguel',
        'Lima - Lima - Santa Anita',
        'Lima - Lima - Santa María del Mar',
        'Lima - Lima - Santa Rosa',
        'Lima - Lima - Santiago de Surco',
        'Lima - Lima - Surquillo',
        'Lima - Lima - Villa El Salvador',
        'Lima - Lima - Villa María del Triunfo',
        'Lima - Oyón - Andajes',
        'Lima - Oyón - Caujul',
        'Lima - Oyón - Cochamarca',
        'Lima - Oyón - Navan',
        'Lima - Oyón - Oyon',
        'Lima - Oyón - Pachangara',
        'Lima - Yauyos - Alis',
        'Lima - Yauyos - Allauca',
        'Lima - Yauyos - Ayaviri',
        'Lima - Yauyos - Azángaro',
        'Lima - Yauyos - Cacra',
        'Lima - Yauyos - Carania',
        'Lima - Yauyos - Catahuasi',
        'Lima - Yauyos - Chocos',
        'Lima - Yauyos - Cochas',
        'Lima - Yauyos - Colonia',
        'Lima - Yauyos - Hongos',
        'Lima - Yauyos - Huampara',
        'Lima - Yauyos - Huancaya',
        'Lima - Yauyos - Huangascar',
        'Lima - Yauyos - Huantan',
        'Lima - Yauyos - Huañec',
        'Lima - Yauyos - Laraos',
        'Lima - Yauyos - Lincha',
        'Lima - Yauyos - Madean',
        'Lima - Yauyos - Miraflores',
        'Lima - Yauyos - Omas',
        'Lima - Yauyos - Putinza',
        'Lima - Yauyos - Quinches',
        'Lima - Yauyos - Quinocay',
        'Lima - Yauyos - San Joaquín',
        'Lima - Yauyos - San Pedro de Pilas',
        'Lima - Yauyos - Tanta',
        'Lima - Yauyos - Tauripampa',
        'Lima - Yauyos - Tomas',
        'Lima - Yauyos - Tupe',
        'Lima - Yauyos - Viñac',
        'Lima - Yauyos - Vitis',
        'Lima - Yauyos - Yauyos',
        'Loreto - Alto Amazonas - Balsapuerto',
        'Loreto - Alto Amazonas - Jeberos',
        'Loreto - Alto Amazonas - Lagunas',
        'Loreto - Alto Amazonas - Santa Cruz',
        'Loreto - Alto Amazonas - Teniente Cesar López Rojas',
        'Loreto - Alto Amazonas - Yurimaguas',
        'Loreto - Datem del Marañón - Andoas',
        'Loreto - Datem del Marañón - Barranca',
        'Loreto - Datem del Marañón - Cahuapanas',
        'Loreto - Datem del Marañón - Manseriche',
        'Loreto - Datem del Marañón - Morona',
        'Loreto - Datem del Marañón - Pastaza',
        'Loreto - Loreto - Nauta',
        'Loreto - Loreto - Parinari',
        'Loreto - Loreto - Tigre',
        'Loreto - Loreto - Trompeteros',
        'Loreto - Loreto - Urarinas',
        'Loreto - Mariscal Ramón Castilla - Pebas',
        'Loreto - Mariscal Ramón Castilla - Ramón Castilla',
        'Loreto - Mariscal Ramón Castilla - San Pablo',
        'Loreto - Mariscal Ramón Castilla - Yavari',
        'Loreto - Maynas - Alto Nanay',
        'Loreto - Maynas - Belén',
        'Loreto - Maynas - Fernando Lores',
        'Loreto - Maynas - Indiana',
        'Loreto - Maynas - Iquitos',
        'Loreto - Maynas - Las Amazonas',
        'Loreto - Maynas - Mazan',
        'Loreto - Maynas - Napo',
        'Loreto - Maynas - Punchana',
        'Loreto - Maynas - San Juan Bautista',
        'Loreto - Maynas - Torres Causana',
        'Loreto - Putumayo - Putumayo',
        'Loreto - Putumayo - Rosa Panduro',
        'Loreto - Putumayo - Teniente Manuel Clavero',
        'Loreto - Putumayo - Yaguas',
        'Loreto - Requena - Alto Tapiche',
        'Loreto - Requena - Capelo',
        'Loreto - Requena - Emilio San Martín',
        'Loreto - Requena - Jenaro Herrera',
        'Loreto - Requena - Maquia',
        'Loreto - Requena - Puinahua',
        'Loreto - Requena - Requena',
        'Loreto - Requena - Saquena',
        'Loreto - Requena - Soplin',
        'Loreto - Requena - Tapiche',
        'Loreto - Requena - Yaquerana',
        'Loreto - Ucayali - Contamana',
        'Loreto - Ucayali - Inahuaya',
        'Loreto - Ucayali - Padre Márquez',
        'Loreto - Ucayali - Pampa Hermosa',
        'Loreto - Ucayali - Sarayacu',
        'Loreto - Ucayali - Vargas Guerra',
        'Madre de Dios - Manu - Fitzcarrald',
        'Madre de Dios - Manu - Huepetuhe',
        'Madre de Dios - Manu - Madre de Dios',
        'Madre de Dios - Manu - Manu',
        'Madre de Dios - Tahuamanu - Iberia',
        'Madre de Dios - Tahuamanu - Iñapari',
        'Madre de Dios - Tahuamanu - Tahuamanu',
        'Madre de Dios - Tambopata - Inambari',
        'Madre de Dios - Tambopata - Laberinto',
        'Madre de Dios - Tambopata - Las Piedras',
        'Madre de Dios - Tambopata - Tambopata',
        'Moquegua - General Sánchez Cerro - Chojata',
        'Moquegua - General Sánchez Cerro - Coalaque',
        'Moquegua - General Sánchez Cerro - Ichuña',
        'Moquegua - General Sánchez Cerro - La Capilla',
        'Moquegua - General Sánchez Cerro - Lloque',
        'Moquegua - General Sánchez Cerro - Matalaque',
        'Moquegua - General Sánchez Cerro - Omate',
        'Moquegua - General Sánchez Cerro - Puquina',
        'Moquegua - General Sánchez Cerro - Quinistaquillas',
        'Moquegua - General Sánchez Cerro - Ubinas',
        'Moquegua - General Sánchez Cerro - Yunga',
        'Moquegua - Ilo - El Algarrobal',
        'Moquegua - Ilo - Ilo',
        'Moquegua - Ilo - Pacocha',
        'Moquegua - Mariscal Nieto - Carumas',
        'Moquegua - Mariscal Nieto - Cuchumbaya',
        'Moquegua - Mariscal Nieto - Moquegua',
        'Moquegua - Mariscal Nieto - Samegua',
        'Moquegua - Mariscal Nieto - San Cristóbal',
        'Moquegua - Mariscal Nieto - Torata',
        'Pasco - Daniel Alcides Carrión - Chacayan',
        'Pasco - Daniel Alcides Carrión - Goyllarisquizga',
        'Pasco - Daniel Alcides Carrión - Paucar',
        'Pasco - Daniel Alcides Carrión - San Pedro de Pillao',
        'Pasco - Daniel Alcides Carrión - Santa Ana de Tusi',
        'Pasco - Daniel Alcides Carrión - Tapuc',
        'Pasco - Daniel Alcides Carrión - Vilcabamba',
        'Pasco - Daniel Alcides Carrión - Yanahuanca',
        'Pasco - Oxapampa - Chontabamba',
        'Pasco - Oxapampa - Constitución',
        'Pasco - Oxapampa - Huancabamba',
        'Pasco - Oxapampa - Oxapampa',
        'Pasco - Oxapampa - Palcazu',
        'Pasco - Oxapampa - Pozuzo',
        'Pasco - Oxapampa - Puerto Bermúdez',
        'Pasco - Oxapampa - Villa Rica',
        'Pasco - Pasco - Chaupimarca',
        'Pasco - Pasco - Huachon',
        'Pasco - Pasco - Huariaca',
        'Pasco - Pasco - Huayllay',
        'Pasco - Pasco - Ninacaca',
        'Pasco - Pasco - Pallanchacra',
        'Pasco - Pasco - Paucartambo',
        'Pasco - Pasco - San Francisco de Asís de Yarusyacan',
        'Pasco - Pasco - Simon Bolívar',
        'Pasco - Pasco - Ticlacayan',
        'Pasco - Pasco - Tinyahuarco',
        'Pasco - Pasco - Vicco',
        'Pasco - Pasco - Yanacancha',
        'Piura - Ayabaca - Ayabaca',
        'Piura - Ayabaca - Frias',
        'Piura - Ayabaca - Jilili',
        'Piura - Ayabaca - Lagunas',
        'Piura - Ayabaca - Montero',
        'Piura - Ayabaca - Pacaipampa',
        'Piura - Ayabaca - Paimas',
        'Piura - Ayabaca - Sapillica',
        'Piura - Ayabaca - Sicchez',
        'Piura - Ayabaca - Suyo',
        'Piura - Huancabamba - Canchaque',
        'Piura - Huancabamba - El Carmen de la Frontera',
        'Piura - Huancabamba - Huancabamba',
        'Piura - Huancabamba - Huarmaca',
        'Piura - Huancabamba - Lalaquiz',
        'Piura - Huancabamba - San Miguel de El Faique',
        'Piura - Huancabamba - Sondor',
        'Piura - Huancabamba - Sondorillo',
        'Piura - Morropón - Buenos Aires',
        'Piura - Morropón - Chalaco',
        'Piura - Morropón - Chulucanas',
        'Piura - Morropón - La Matanza',
        'Piura - Morropón - Morropon',
        'Piura - Morropón - Salitral',
        'Piura - Morropón - San Juan de Bigote',
        'Piura - Morropón - Santa Catalina de Mossa',
        'Piura - Morropón - Santo Domingo',
        'Piura - Morropón - Yamango',
        'Piura - Paita - Amotape',
        'Piura - Paita - Arenal',
        'Piura - Paita - Colan',
        'Piura - Paita - La Huaca',
        'Piura - Paita - Paita',
        'Piura - Paita - Tamarindo',
        'Piura - Paita - Vichayal',
        'Piura - Piura - Castilla',
        'Piura - Piura - Catacaos',
        'Piura - Piura - Cura Mori',
        'Piura - Piura - El Tallan',
        'Piura - Piura - La Arena',
        'Piura - Piura - La Unión',
        'Piura - Piura - Las Lomas',
        'Piura - Piura - Piura',
        'Piura - Piura - Tambo Grande',
        'Piura - Piura - Veintiseis de Octubre',
        'Piura - Sechura - Bellavista de la Unión',
        'Piura - Sechura - Bernal',
        'Piura - Sechura - Cristo Nos Valga',
        'Piura - Sechura - Rinconada Llicuar',
        'Piura - Sechura - Sechura',
        'Piura - Sechura - Vice',
        'Piura - Sullana - Bellavista',
        'Piura - Sullana - Ignacio Escudero',
        'Piura - Sullana - Lancones',
        'Piura - Sullana - Marcavelica',
        'Piura - Sullana - Miguel Checa',
        'Piura - Sullana - Querecotillo',
        'Piura - Sullana - Salitral',
        'Piura - Sullana - Sullana',
        'Piura - Talara - El Alto',
        'Piura - Talara - La Brea',
        'Piura - Talara - Lobitos',
        'Piura - Talara - Los Organos',
        'Piura - Talara - Mancora',
        'Piura - Talara - Pariñas',
        'Puno - Azángaro - Achaya',
        'Puno - Azángaro - Arapa',
        'Puno - Azángaro - Asillo',
        'Puno - Azángaro - Azángaro',
        'Puno - Azángaro - Caminaca',
        'Puno - Azángaro - Chupa',
        'Puno - Azángaro - José Domingo Choquehuanca',
        'Puno - Azángaro - Muñani',
        'Puno - Azángaro - Potoni',
        'Puno - Azángaro - Saman',
        'Puno - Azángaro - San Anton',
        'Puno - Azángaro - San José',
        'Puno - Azángaro - San Juan de Salinas',
        'Puno - Azángaro - Santiago de Pupuja',
        'Puno - Azángaro - Tirapata',
        'Puno - Carabaya - Ajoyani',
        'Puno - Carabaya - Ayapata',
        'Puno - Carabaya - Coasa',
        'Puno - Carabaya - Corani',
        'Puno - Carabaya - Crucero',
        'Puno - Carabaya - Ituata',
        'Puno - Carabaya - Macusani',
        'Puno - Carabaya - Ollachea',
        'Puno - Carabaya - San Gaban',
        'Puno - Carabaya - Usicayos',
        'Puno - Chucuito - Desaguadero',
        'Puno - Chucuito - Huacullani',
        'Puno - Chucuito - Juli',
        'Puno - Chucuito - Kelluyo',
        'Puno - Chucuito - Pisacoma',
        'Puno - Chucuito - Pomata',
        'Puno - Chucuito - Zepita',
        'Puno - El Collao - Capazo',
        'Puno - El Collao - Conduriri',
        'Puno - El Collao - Ilave',
        'Puno - El Collao - Pilcuyo',
        'Puno - El Collao - Santa Rosa',
        'Puno - Huancané - Cojata',
        'Puno - Huancané - Huancane',
        'Puno - Huancané - Huatasani',
        'Puno - Huancané - Inchupalla',
        'Puno - Huancané - Pusi',
        'Puno - Huancané - Rosaspata',
        'Puno - Huancané - Taraco',
        'Puno - Huancané - Vilque Chico',
        'Puno - Lampa - Cabanilla',
        'Puno - Lampa - Calapuja',
        'Puno - Lampa - Lampa',
        'Puno - Lampa - Nicasio',
        'Puno - Lampa - Ocuviri',
        'Puno - Lampa - Palca',
        'Puno - Lampa - Paratia',
        'Puno - Lampa - Pucara',
        'Puno - Lampa - Santa Lucia',
        'Puno - Lampa - Vilavila',
        'Puno - Melgar - Antauta',
        'Puno - Melgar - Ayaviri',
        'Puno - Melgar - Cupi',
        'Puno - Melgar - Llalli',
        'Puno - Melgar - Macari',
        'Puno - Melgar - Nuñoa',
        'Puno - Melgar - Orurillo',
        'Puno - Melgar - Santa Rosa',
        'Puno - Melgar - Umachiri',
        'Puno - Moho - Conima',
        'Puno - Moho - Huayrapata',
        'Puno - Moho - Moho',
        'Puno - Moho - Tilali',
        'Puno - Puno - Acora',
        'Puno - Puno - Amantani',
        'Puno - Puno - Atuncolla',
        'Puno - Puno - Capachica',
        'Puno - Puno - Chucuito',
        'Puno - Puno - Coata',
        'Puno - Puno - Huata',
        'Puno - Puno - Mañazo',
        'Puno - Puno - Paucarcolla',
        'Puno - Puno - Pichacani',
        'Puno - Puno - Plateria',
        'Puno - Puno - Puno',
        'Puno - Puno - San Antonio',
        'Puno - Puno - Tiquillaca',
        'Puno - Puno - Vilque',
        'Puno - San Antonio de Putina - Ananea',
        'Puno - San Antonio de Putina - Pedro Vilca Apaza',
        'Puno - San Antonio de Putina - Putina',
        'Puno - San Antonio de Putina - Quilcapuncu',
        'Puno - San Antonio de Putina - Sina',
        'Puno - San Román - Cabana',
        'Puno - San Román - Cabanillas',
        'Puno - San Román - Caracoto',
        'Puno - San Román - Juliaca',
        'Puno - San Román - San Miguel',
        'Puno - Sandia - Alto Inambari',
        'Puno - Sandia - Cuyocuyo',
        'Puno - Sandia - Limbani',
        'Puno - Sandia - Patambuco',
        'Puno - Sandia - Phara',
        'Puno - Sandia - Quiaca',
        'Puno - Sandia - San Juan del Oro',
        'Puno - Sandia - San Pedro de Putina Punco',
        'Puno - Sandia - Sandia',
        'Puno - Sandia - Yanahuaya',
        'Puno - Yunguyo - Anapia',
        'Puno - Yunguyo - Copani',
        'Puno - Yunguyo - Cuturapi',
        'Puno - Yunguyo - Ollaraya',
        'Puno - Yunguyo - Tinicachi',
        'Puno - Yunguyo - Unicachi',
        'Puno - Yunguyo - Yunguyo',
        'San Martín - Bellavista - Alto Biavo',
        'San Martín - Bellavista - Bajo Biavo',
        'San Martín - Bellavista - Bellavista',
        'San Martín - Bellavista - Huallaga',
        'San Martín - Bellavista - San Pablo',
        'San Martín - Bellavista - San Rafael',
        'San Martín - El Dorado - Agua Blanca',
        'San Martín - El Dorado - San José de Sisa',
        'San Martín - El Dorado - San Martín',
        'San Martín - El Dorado - Santa Rosa',
        'San Martín - El Dorado - Shatoja',
        'San Martín - Huallaga - Alto Saposoa',
        'San Martín - Huallaga - El Eslabón',
        'San Martín - Huallaga - Piscoyacu',
        'San Martín - Huallaga - Sacanche',
        'San Martín - Huallaga - Saposoa',
        'San Martín - Huallaga - Tingo de Saposoa',
        'San Martín - Lamas - Alonso de Alvarado',
        'San Martín - Lamas - Barranquita',
        'San Martín - Lamas - Caynarachi',
        'San Martín - Lamas - Cuñumbuqui',
        'San Martín - Lamas - Lamas',
        'San Martín - Lamas - Pinto Recodo',
        'San Martín - Lamas - Rumisapa',
        'San Martín - Lamas - San Roque de Cumbaza',
        'San Martín - Lamas - Shanao',
        'San Martín - Lamas - Tabalosos',
        'San Martín - Lamas - Zapatero',
        'San Martín - Mariscal Cáceres - Campanilla',
        'San Martín - Mariscal Cáceres - Huicungo',
        'San Martín - Mariscal Cáceres - Juanjuí',
        'San Martín - Mariscal Cáceres - Pachiza',
        'San Martín - Mariscal Cáceres - Pajarillo',
        'San Martín - Moyobamba - Calzada',
        'San Martín - Moyobamba - Habana',
        'San Martín - Moyobamba - Jepelacio',
        'San Martín - Moyobamba - Moyobamba',
        'San Martín - Moyobamba - Soritor',
        'San Martín - Moyobamba - Yantalo',
        'San Martín - Picota - Buenos Aires',
        'San Martín - Picota - Caspisapa',
        'San Martín - Picota - Picota',
        'San Martín - Picota - Pilluana',
        'San Martín - Picota - Pucacaca',
        'San Martín - Picota - San Cristóbal',
        'San Martín - Picota - San Hilarión',
        'San Martín - Picota - Shamboyacu',
        'San Martín - Picota - Tingo de Ponasa',
        'San Martín - Picota - Tres Unidos',
        'San Martín - Rioja - Awajun',
        'San Martín - Rioja - Elías Soplin Vargas',
        'San Martín - Rioja - Nueva Cajamarca',
        'San Martín - Rioja - Pardo Miguel',
        'San Martín - Rioja - Posic',
        'San Martín - Rioja - Rioja',
        'San Martín - Rioja - San Fernando',
        'San Martín - Rioja - Yorongos',
        'San Martín - Rioja - Yuracyacu',
        'San Martín - San Martín - Alberto Leveau',
        'San Martín - San Martín - Cacatachi',
        'San Martín - San Martín - Chazuta',
        'San Martín - San Martín - Chipurana',
        'San Martín - San Martín - El Porvenir',
        'San Martín - San Martín - Huimbayoc',
        'San Martín - San Martín - Juan Guerra',
        'San Martín - San Martín - La Banda de Shilcayo',
        'San Martín - San Martín - Morales',
        'San Martín - San Martín - Papaplaya',
        'San Martín - San Martín - San Antonio',
        'San Martín - San Martín - Sauce',
        'San Martín - San Martín - Shapaja',
        'San Martín - San Martín - Tarapoto',
        'San Martín - Tocache - Nuevo Progreso',
        'San Martín - Tocache - Polvora',
        'San Martín - Tocache - Shunte',
        'San Martín - Tocache - Tocache',
        'San Martín - Tocache - Uchiza',
        'Tacna - Candarave - Cairani',
        'Tacna - Candarave - Camilaca',
        'Tacna - Candarave - Candarave',
        'Tacna - Candarave - Curibaya',
        'Tacna - Candarave - Huanuara',
        'Tacna - Candarave - Quilahuani',
        'Tacna - Jorge Basadre - Ilabaya',
        'Tacna - Jorge Basadre - Ite',
        'Tacna - Jorge Basadre - Locumba',
        'Tacna - Tacna - Alto de la Alianza',
        'Tacna - Tacna - Calana',
        'Tacna - Tacna - Ciudad Nueva',
        'Tacna - Tacna - Coronel Gregorio Albarracín Lanchipa',
        'Tacna - Tacna - Inclan',
        'Tacna - Tacna - La Yarada los Palos',
        'Tacna - Tacna - Pachia',
        'Tacna - Tacna - Palca',
        'Tacna - Tacna - Pocollay',
        'Tacna - Tacna - Sama',
        'Tacna - Tacna - Tacna',
        'Tacna - Tarata - Estique',
        'Tacna - Tarata - Estique-Pampa',
        'Tacna - Tarata - Héroes Albarracín',
        'Tacna - Tarata - Sitajara',
        'Tacna - Tarata - Susapaya',
        'Tacna - Tarata - Tarata',
        'Tacna - Tarata - Tarucachi',
        'Tacna - Tarata - Ticaco',
        'Tumbes - Contralmirante Villar - Canoas de Punta Sal',
        'Tumbes - Contralmirante Villar - Casitas',
        'Tumbes - Contralmirante Villar - Zorritos',
        'Tumbes - Tumbes - Corrales',
        'Tumbes - Tumbes - La Cruz',
        'Tumbes - Tumbes - Pampas de Hospital',
        'Tumbes - Tumbes - San Jacinto',
        'Tumbes - Tumbes - San Juan de la Virgen',
        'Tumbes - Tumbes - Tumbes',
        'Tumbes - Zarumilla - Aguas Verdes',
        'Tumbes - Zarumilla - Matapalo',
        'Tumbes - Zarumilla - Papayal',
        'Tumbes - Zarumilla - Zarumilla',
        'Ucayali - Atalaya - Raymondi',
        'Ucayali - Atalaya - Sepahua',
        'Ucayali - Atalaya - Tahuania',
        'Ucayali - Atalaya - Yurua',
        'Ucayali - Coronel Portillo - Calleria',
        'Ucayali - Coronel Portillo - Campoverde',
        'Ucayali - Coronel Portillo - Iparia',
        'Ucayali - Coronel Portillo - Manantay',
        'Ucayali - Coronel Portillo - Masisea',
        'Ucayali - Coronel Portillo - Nueva Requena',
        'Ucayali - Coronel Portillo - Yarinacocha',
        'Ucayali - Padre Abad - Alexander Von Humboldt',
        'Ucayali - Padre Abad - Curimana',
        'Ucayali - Padre Abad - Irazola',
        'Ucayali - Padre Abad - Neshuya',
        'Ucayali - Padre Abad - Padre Abad',
        'Ucayali - Purús - Purus'
    ];

    const LOCATIONS = {
        'Lima': {
            'Lima': ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'San Borja', 'Cercado de Lima'],
            'Barranca': ['Barranca', 'Supe'],
        },
        'Arequipa': {
            'Arequipa': ['Cercado', 'Cayma', 'Yanahuara']
        },
        'Cusco': {
            'Cusco': ['Cusco', 'Wanchaq', 'San Sebastián']
        }
    };

    const REVIEWS = [
        { name: "Juan P.", city: "Lima", text: "Excelente atención, llegó en menos de 48 horas a mi casa. Muy confiables.", rating: 5, date: "15/01/2026" },
        { name: "María L.", city: "Arequipa", text: "Me daba miedo pagar por adelantado, pero el servicio contra entrega es genial. Todo conforme.", rating: 5, date: "10/01/2026" },
        { name: "Fernando G.", city: "Lima", text: "Seguridad total al comprar aquí. Todo llegó bien sellado, original y puntual.", rating: 5, date: "14/01/2026" },
        { name: "Lucía S.", city: "Trujillo", text: "Atención de primera. Respondieron todas mis dudas y el pedido llegó súper rápido.", rating: 5, date: "08/01/2026" },
        { name: "Carlos M.", city: "Cusco", text: "Sin complicaciones. El proceso de compra fue muy fluido y seguro. ¡Gracias!", rating: 5, date: "12/01/2026" },
        { name: "Elena R.", city: "Piura", text: "Llegó súper rápido y el empaque muy bien protegido. Se nota la seriedad.", rating: 5, date: "14/01/2026" },
        { name: "Miguel S.", city: "Chiclayo", text: "Me encantó la puntualidad. El motorizado fue muy amable y el pago contra entrega me dio mucha confianza.", rating: 5, date: "11/01/2026" },
        { name: "Carmen B.", city: "Lima", text: "Todo perfecto, desde el trato hasta la entrega final. Muy satisfecho con la compra.", rating: 5, date: "15/01/2026" },
        { name: "Luis T.", city: "Lima", text: "Súper recomendado. El envío fue muy puntual y la comunicación constante.", rating: 5, date: "02/01/2026" },
        { name: "Ana B.", city: "Iquitos", text: "Tenía mis dudas al principio, pero recibirlo y pagar al momento es lo mejor.", rating: 5, date: "09/01/2026" }
    ];

    // === PRELOADER ===
    const preloader = document.getElementById('brand-preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.classList.remove('is-loading');

            // Iniciar animaciones de la web después del preloader si es necesario
            console.log("🚀 Preloader finalizado. Iniciando landing.");
        }, 2000); // 2 segundos exactos
    }

    // === STATE ===
    let state = {
        cart: new Set(), // Set of product IDs
        total: 0,
        discount: 0,
        shipping: 0,
        finalTotal: 0,
        modalStep: 1,
        selectedDepartment: '',
        selectedDistrict: ''
    };

    // === DOM ELEMENTS ===
    const stickyFooter = document.getElementById('sticky-footer');
    const selectedCountEl = document.getElementById('selected-count');
    const footerTotalEl = document.getElementById('footer-total');
    const modal = document.getElementById('order-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const stepIndicators = document.querySelectorAll('.step-bar');
    const stepSections = document.querySelectorAll('[data-step]');

    // === INIT ===
    function init() {
        renderReviews();
        initModal();
        startSalesPopup();

        // Escuchar actualizaciones del carrito
        window.addEventListener('cart-updated', (e) => {
            updateStickyFooter(e.detail);
            updateModalSummary(e.detail);
        });

        // Verificar estado inicial del carrito
        if (window.CartManager && window.CartManager.getCount() > 0) {
            const detail = {
                count: window.CartManager.getCount(),
                total: window.CartManager.getTotal(),
                items: window.CartManager.getItems()
            };
            updateStickyFooter(detail);
            updateModalSummary(detail);
        }
    }

    // === MODAL ===
    function initModal() {
        openModalBtn.addEventListener('click', () => openModal());
        closeModalBtn.addEventListener('click', () => closeModal());

        // Inicializar campo de ubicación con búsqueda
        const locationInput = document.getElementById('location-search');
        const locationDropdown = document.getElementById('location-dropdown');

        // Filtrar ubicaciones mientras escribe
        // Helper para normalizar texto (quitar tildes y caracteres especiales)
        const normalizeText = (text) => {
            return text.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
        };

        // Filtrar ubicaciones mientras escribe (Búsqueda Inteligente/Difusa)
        locationInput.addEventListener('input', (e) => {
            const rawSearch = e.target.value;
            const searchTerm = normalizeText(rawSearch);

            if (searchTerm.length < 2) {
                locationDropdown.style.display = 'none';
                return;
            }

            // Dividir la búsqueda en palabras para permitir búsqueda flexible
            const searchWords = searchTerm.split(/\s+/).filter(w => w.length > 0);

            const filtered = PERU_LOCATIONS.filter(loc => {
                const normalizedLoc = normalizeText(loc);

                // 1. Coincidencia exacta de palabras (aunque cambie el orden)
                const matchesWords = searchWords.every(word => normalizedLoc.includes(word));

                if (matchesWords) return true;

                // 2. Coincidencia difusa (si la búsqueda es una sola palabra larga, permitir pequeños errores)
                if (searchTerm.length > 4) {
                    // Si el 80% de la búsqueda coincide o es muy similar
                    // (Lógica simplificada para no afectar rendimiento)
                    const locWords = normalizedLoc.split(/\s+/);
                    return locWords.some(lw => lw.startsWith(searchTerm) || searchTerm.startsWith(lw));
                }

                return false;
            });

            // Ordenar: Primero los que empiezan por el término buscado
            filtered.sort((a, b) => {
                const normA = normalizeText(a);
                const normB = normalizeText(b);
                const startsA = normA.includes(searchTerm) ? 0 : 1;
                const startsB = normB.includes(searchTerm) ? 0 : 1;
                return startsA - startsB;
            });

            if (filtered.length === 0) {
                locationDropdown.innerHTML = '<div style="padding: 15px; text-align: center; color: #666; font-size: 0.9rem;">No se encontraron distritos similares</div>';
            } else {
                locationDropdown.innerHTML = filtered.slice(0, 10).map(loc => `
                    <div class="location-option" data-location="${loc}">${loc}</div>
                `).join('');

                if (filtered.length > 10) {
                    locationDropdown.innerHTML += `<div style="padding: 10px; text-align: center; color: #888; font-size: 0.8rem; border-top: 1px solid #eee;">...y ${filtered.length - 10} más resultados</div>`;
                }
            }

            locationDropdown.style.display = 'block';
        });

        // Seleccionar ubicación del dropdown
        locationDropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.location-option');
            if (option) {
                const selectedLocation = option.dataset.location;
                locationInput.value = selectedLocation;
                locationDropdown.style.display = 'none';

                // Guardar selección
                const parts = selectedLocation.split(' - ');
                state.selectedDepartment = parts[0];
                state.selectedDistrict = parts[2];
            }
        });

        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!locationInput.contains(e.target) && !locationDropdown.contains(e.target)) {
                locationDropdown.style.display = 'none';
            }
        });
    }

    // === UTILITY FUNCTIONS ===

    function calculateShipping(department, district) {
        // Envío gratis sobre S/ 300
        const cartData = window.CartManager || { getTotal: () => 0 };
        const subtotal = cartData.getTotal();

        if (subtotal >= 300) {
            return 0;
        }

        // Tarifas de envío
        if (department === 'Lima') {
            const premiumDistricts = ['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'San Borja'];
            if (premiumDistricts.includes(district)) {
                return 10.00;
            }
            return 15.00;
        }

        return 25.00; // Provincias
    }

    function validatePeruvianPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return /^9\d{8}$/.test(cleaned);
    }

    function generateWhatsAppLink() {
        const cartData = window.CartManager || { getItems: () => [], getTotal: () => 0 };
        const name = document.getElementById('input-name').value;
        const dni = document.getElementById('input-dni').value;
        const email = document.getElementById('input-email').value;
        const phone = document.getElementById('input-phone').value;
        const location = document.getElementById('location-search').value;
        const address = document.getElementById('input-address').value;

        const items = cartData.getItems();
        const subtotal = cartData.getTotal();
        const shipping = state.shipping;
        const total = subtotal + shipping;

        const message = `¡Hola! Quiero realizar este pedido:\n\n` +
            `*Productos:*\n${items.map(i => `- ${i.name} (x${i.quantity}) - S/ ${(i.price * i.quantity).toFixed(2)}`).join('\n')}\n\n` +
            `*Subtotal:* S/ ${subtotal.toFixed(2)}\n` +
            `*Envío:* S/ ${shipping.toFixed(2)}\n` +
            `*TOTAL:* S/ ${total.toFixed(2)}\n\n` +
            `*Datos de contacto:*\n` +
            `Nombre: ${name}\n` +
            `DNI: ${dni}\n` +
            `Email: ${email}\n` +
            `Teléfono: ${phone}\n\n` +
            `*Dirección de entrega:*\n` +
            `${location}\n` +
            `${address}`;

        const whatsappPhone = '51999999999'; // Reemplazar con tu número
        return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    }

    window.previousStep = (current) => {
        if (current > 1) {
            showStep(current - 1);
        }
    };


    function openModal() {
        const cartData = window.CartManager || { getCount: () => 0 };
        if (cartData.getCount() === 0) {
            return alert('Selecciona al menos un producto');
        }

        modal.classList.add('active');
        state.modalStep = 1;
        showStep(1);

        // Actualizar summary al abrir
        updateModalSummary({
            count: cartData.getCount(),
            total: cartData.getTotal(),
            items: cartData.getItems()
        });
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    window.nextStep = (current) => {
        // Validation with visual feedback
        if (current === 1) {
            const name = document.getElementById('input-name').value;
            const dni = document.getElementById('input-dni').value;
            const email = document.getElementById('input-email').value;
            const phone = document.getElementById('input-phone').value;

            if (name.length < 3) {
                return alert('❌ Por favor ingresa un nombre válido (mínimo 3 caracteres)');
            }

            // Validar DNI peruano: 8 dígitos numéricos
            const dniCleaned = dni.replace(/\D/g, '');
            if (dniCleaned.length !== 8) {
                return alert('❌ Ingresa un DNI válido (8 dígitos)');
            }

            // Validar email básico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return alert('❌ Ingresa un correo electrónico válido');
            }

            if (!validatePeruvianPhone(phone)) {
                return alert('❌ Ingresa un número de teléfono peruano válido (9 dígitos, ejemplo: 987654321)');
            }
        } else if (current === 2) {
            const location = document.getElementById('location-search').value;
            const addr = document.getElementById('input-address').value;

            if (!location || location.length < 5) {
                return alert('❌ Selecciona una ubicación del listado');
            }

            // Validar formato: debe tener 2 guiones (Dpto - Prov - Dist)
            const parts = location.split(' - ');
            if (parts.length !== 3) {
                return alert('❌ Por favor selecciona una ubicación válida de la lista\nFormato: Departamento - Provincia - Distrito');
            }

            if (addr.length < 10) {
                return alert('❌ Ingresa una dirección completa (mínimo 10 caracteres)');
            }

            // Extraer departamento y distrito de la ubicación seleccionada
            state.selectedDepartment = parts[0].trim();
            state.selectedDistrict = parts[2].trim();
            state.shipping = calculateShipping(parts[0].trim(), parts[2].trim());

            // Actualizar el resumen con envío
            const cartData = window.CartManager || { getTotal: () => 0, getItems: () => [], getCount: () => 0 };
            updateModalSummary({
                count: cartData.getCount(),
                total: cartData.getTotal(),
                items: cartData.getItems(),
                shipping: state.shipping
            });
        }

        showStep(current + 1);
    };

    function showStep(step) {
        state.modalStep = step;
        stepSections.forEach(el => el.style.display = 'none');
        document.querySelector(`[data-step="${step}"]`).style.display = 'block';

        stepIndicators.forEach((el, idx) => {
            el.classList.toggle('active', idx < step);
        });
    }

    function updateStickyFooter(cartData) {
        selectedCountEl.textContent = cartData.count;
        footerTotalEl.textContent = `S/ ${cartData.total.toFixed(2)}`;

        // Mostrar/ocultar sticky footer
        if (cartData.count > 0) {
            stickyFooter.classList.add('active');
        } else {
            stickyFooter.classList.remove('active');
        }
    }

    function updateModalSummary(cartData) {
        const listEl = document.getElementById('summary-list');
        const summaryTotal = document.getElementById('summary-total');
        const summarySubtotal = document.getElementById('summary-subtotal');
        const summaryShipping = document.getElementById('summary-shipping');

        if (!listEl || !summaryTotal) return;

        if (!cartData || cartData.count === 0) {
            listEl.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">No hay productos seleccionados</div>';
            if (summaryTotal) summaryTotal.textContent = 'S/ 0.00';
            if (summarySubtotal) summarySubtotal.textContent = 'S/ 0.00';
            if (summaryShipping) summaryShipping.textContent = 'S/ 0.00';
            return;
        }

        const subtotal = cartData.total || 0;
        const shipping = window.STORE_CONFIG ? window.STORE_CONFIG.envioBase : 15;
        const total = subtotal + shipping;

        listEl.innerHTML = cartData.items.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee; gap: 10px;">
                <div style="font-weight: 500; font-size: 0.9rem; color: #333; line-height: 1.3;">
                    ${item.name} <span style="color: #666; font-weight: normal; margin-left: 4px;">x${item.quantity}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                    <div style="font-weight: 700; color: #1A472A; font-size: 0.95rem;">S/ ${(item.price * item.quantity).toFixed(2)}</div>
                    <button 
                        onclick="window.CartManager.remove(${item.id})" 
                        style="background: transparent; color: #999; border: none; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; padding: 0;"
                        onmouseover="this.style.color='#ff4444'"
                        onmouseout="this.style.color='#999'"
                        title="Eliminar producto">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        // Actualizar desglose de costos
        if (summarySubtotal) summarySubtotal.textContent = `S/ ${subtotal.toFixed(2)}`;
        if (summaryShipping) {
            if (shipping === 0 && subtotal >= 300) {
                summaryShipping.innerHTML = `<span style="color: #0C9145; font-weight: 600;">¡GRATIS!</span> <small>(Sobre S/ 300)</small>`;
            } else if (shipping === 0) {
                summaryShipping.textContent = 'S/ 0.00';
            } else {
                summaryShipping.textContent = `S/ ${shipping.toFixed(2)}`;
            }
        }

        summaryTotal.textContent = `S/ ${total.toFixed(2)}`;
    }

    window.confirmOrder = () => {
        const btn = document.getElementById('confirm-btn');
        const originalText = btn.textContent;
        const cartData = window.CartManager || { getItems: () => [] };
        const items = cartData.getItems();

        if (items.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const name = document.getElementById('input-name').value;
        const dni = document.getElementById('input-dni').value;
        const email = document.getElementById('input-email').value;
        const phone = document.getElementById('input-phone').value;
        const address = document.getElementById('input-address').value;
        // State values captured during step 2
        const department = state.selectedDepartment || 'Lima';
        const district = state.selectedDistrict || 'Lima';
        const shipping = state.shipping || 0;

        btn.textContent = 'Procesando pedido...';
        btn.disabled = true;

        // Payload
        const payload = {
            first_name: name,
            email: email,
            phone: phone,
            address: address,
            department: department,
            district: district,
            dni: dni,
            items: items.map(i => ({ id: i.id, quantity: i.quantity })),
            shipping_total: shipping
        };

        // AJAX Request
        const finalAjaxUrl = (typeof ajaxurl !== 'undefined') ? ajaxurl : ((typeof sll_ajax_url !== 'undefined') ? sll_ajax_url : '/wp-admin/admin-ajax.php');

        fetch(finalAjaxUrl + '?action=sll_create_order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Vaciar carrito antes de redirigir
                    if (window.CartManager) {
                        window.CartManager.items.clear();
                        window.CartManager.save();
                        window.CartManager.notify();
                    }
                    // También limpiar por si acaso el localStorage directamente
                    localStorage.removeItem('perfumes_cart');

                    // Redirect to Thank You Page
                    window.location.href = data.data.redirect_url;
                } else {
                    alert('Hubo un error al procesar tu pedido: ' + (data.data.message || 'Error desconocido'));
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error de conexiÃ³n. IntÃ©ntalo de nuevo.');
                btn.textContent = originalText;
                btn.disabled = false;
            });
    };

    // === UTILS ===
    // startCountdown removed in favor of initCountdown

    function renderReviews() {
        // Seleccionar específicamente el swiper de reviews, no el del carrusel de productos
        const reviewsSection = document.querySelector('.reviews-section');
        if (!reviewsSection) return;

        const swiperWrap = reviewsSection.querySelector('.swiper-wrapper');
        if (!swiperWrap) return;

        // Intentar obtener la URL base de varias fuentes
        let baseUrl = window.sll_base_url || (window.wp_data ? window.wp_data.base_url : null) || './';

        console.log('[DEBUG] Usando Base URL para reviews:', baseUrl);

        swiperWrap.innerHTML = REVIEWS.map((r, index) => {
            const clientImageNum = (index % 10) + 1;
            // Asegurar que la ruta sea absoluta usando la base detectada
            const imgSrc = baseUrl.endsWith('/') ? `${baseUrl}client${clientImageNum}.png` : `${baseUrl}/client${clientImageNum}.png`;

            return `
            <div class="swiper-slide review-card">
                <div class="review-image-top">
                    <img src="${imgSrc}" alt="Cliente" class="review-img-full">
                </div>
                <div class="review-content">
                    <div class="review-meta-top">
                        <span class="review-name">${r.name}</span>
                        <svg class="verified-badge-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    </div>
                    <div class="review-date-text">${r.date}</div>
                    <div class="text-warning mb-2" style="font-size: 1rem;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                    <p class="review-body-text">"${r.text}"</p>
                    <div class="review-footer-info">
                        Compra desde ${r.city}
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }

    function startSalesPopup() {
        const popup = document.getElementById('sales-popup');
        const names = ['María', 'José', 'Luis', 'Ana', 'Carlos', 'Sofía', 'Pedro', 'Lucía', 'Jorge', 'Elena', 'Carmen', 'Miguel', 'Rosa'];

        // Realistic Perfumes List
        const products = [
            'Savage - Dior', 'Bleu - Chanel', 'La Vie Est Belle', 'Acqua di Gio', 'Good Girl',
            'One Million', 'L\'Interdit', 'Coco Mademoiselle', 'Versace Eros', 'Black Opium'
        ];

        // Helper to get random item
        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // Helper to get realistic time (skewed natural distribution)
        const getTimeAgo = () => {
            const r = Math.random();
            if (r < 0.2) return 'Hace un instante';
            if (r < 0.5) return `Hace ${Math.floor(Math.random() * 20) + 1} min`;
            if (r < 0.8) return `Hace ${Math.floor(Math.random() * 40) + 20} min`;
            return `Hace ${Math.floor(Math.random() * 3) + 1} h`;
        };

        const showPopup = () => {
            // Check if mobile and in first 100vh
            const isMobile = window.innerWidth <= 768;
            const scrollPos = window.scrollY || window.pageYOffset;
            const vh = window.innerHeight;

            if (isMobile) return; // Desactivar en móviles por solicitud del usuario

            // 1. Pick location
            let location = "Lima";
            if (typeof PERU_LOCATIONS !== 'undefined' && PERU_LOCATIONS.length > 0) {
                const fullLoc = getRandom(PERU_LOCATIONS);
                // "Amazonas - Chachapoyas - Chachapoyas" -> "Chachapoyas"
                // "Lima - Lima - Miraflores" -> "Miraflores, Lima"
                const parts = fullLoc.split(' - ');
                if (parts.length >= 3) {
                    location = parts[0] === parts[1] ? parts[2] : `${parts[2]}, ${parts[0]}`;
                } else {
                    location = fullLoc;
                }
            }

            // 2. Pick Data
            const name = getRandom(names);

            const productData = getRandom(window.WCF_PRODUCTS && window.WCF_PRODUCTS.length > 0 ? window.WCF_PRODUCTS : products.map(p => ({ name: p, image: null })));
            const product = typeof productData === 'string' ? productData : productData.name;
            const productImage = productData.image;
            const time = getTimeAgo();
            const letter = product.charAt(0);

            // 3. Render HTML (Improved Design)
            let imageHtml = `
                <div style="width: 55px; height: 55px; background: #f8f8f8; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #eee; overflow: hidden;">
                    <span style="font-size: 1.5rem; color: #1A472A; font-weight: 700;">${letter}</span>
                </div>
            `;

            if (productImage) {
                imageHtml = `
                    <div style="width: 55px; height: 55px; background: #f8f8f8; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #eee; overflow: hidden;">
                        <img src="${productImage}" alt="${product}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                `;
            }

            popup.innerHTML = `
                 <div style="display: flex; gap: 15px; align-items: center; font-family: 'DM Sans', sans-serif;">
                     <div style="position: relative; flex-shrink: 0;">
                          ${imageHtml}
                          <div style="position: absolute; bottom: -6px; right: -6px; background: #00B67A; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                          </div>
                     </div>
                     <div style="flex-grow: 1;">
                         <div style="font-size: 0.95rem; color: #1f2937; line-height: 1.3;">
                             <span style="font-weight: 700;">${name}</span> de ${location}
                         </div>
                         <div style="font-size: 0.85rem; color: #4b5563; margin: 2px 0;">
                             Compró <strong style="color: #1A472A;">${product}</strong>
                         </div>
                         <div style="display: flex; align-items: center; gap: 10px; margin-top: 2px;">
                             <span style="font-size: 0.75rem; color: #9ca3af;">${time}</span>
                             <div style="display: flex; gap: 1px;">
                                 <span style="color: #fbbf24; font-size: 0.8rem;">&#9733;</span>
                                 <span style="color: #fbbf24; font-size: 0.8rem;">&#9733;</span>
                                 <span style="color: #fbbf24; font-size: 0.8rem;">&#9733;</span>
                                 <span style="color: #fbbf24; font-size: 0.8rem;">&#9733;</span>
                                 <span style="color: #fbbf24; font-size: 0.8rem;">&#9733;</span>
                             </div>
                         </div>
                     </div>
                 </div>
             `;

            popup.classList.add('show');
            // Hide after 6 seconds
            setTimeout(() => popup.classList.remove('show'), 6000);
        };

        // Random Initial Delay (5s) then random intervals (15s - 45s)
        setTimeout(() => {
            // First show
            showPopup();

            // Loop
            const schedule = () => {
                const delay = Math.floor(Math.random() * (45000 - 15000 + 1)) + 15000;
                setTimeout(() => {
                    showPopup();
                    schedule();
                }, delay);
            };
            schedule();
        }, 5000);
    }

    // ============================================
    // COUNTDOWN TIMER
    // ============================================
    // ============================================
    // SMART SHIPPING COUNTDOWN (10am, 3pm, 9pm)
    // ============================================
    function initCountdown() {
        const titleEl = document.getElementById('urgency-title-dynamic');
        const messageEl = document.getElementById('urgency-message-dynamic');

        // Use classes for marquee elements (since they are repeated)
        const bannerDayEls = document.querySelectorAll('.banner-shipping-day');
        const bannerCountdownEls = document.querySelectorAll('.banner-countdown');
        const bannerShippingTimeEls = document.querySelectorAll('.banner-shipping-time');

        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        function updateSmartCountdown() {
            const now = new Date();
            const currentHour = now.getHours();

            // Definir cortes: 10:00, 15:00 (3pm), 21:00 (9pm)
            let nextCutoff = new Date(now);
            let shippingTimeText = "";
            let shippingDayText = "HOY";

            if (currentHour < 10) {
                nextCutoff.setHours(10, 0, 0, 0);
                shippingTimeText = "10:00 AM";
                shippingDayText = "HOY";
            } else if (currentHour < 15) {
                nextCutoff.setHours(15, 0, 0, 0);
                shippingTimeText = "3:00 PM";
                shippingDayText = "HOY";
            } else if (currentHour < 21) {
                nextCutoff.setHours(21, 0, 0, 0);
                shippingTimeText = "9:00 PM";
                shippingDayText = "HOY";
            } else {
                nextCutoff.setDate(now.getDate() + 1);
                nextCutoff.setHours(10, 0, 0, 0);
                shippingTimeText = "10:00 AM";
                shippingDayText = "MAÑANA";
            }

            const diff = nextCutoff - now;

            // Calcular tiempo restante
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            const timerString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

            // Actualizar Todos los elementos del Banner Superior (Marquee)
            bannerCountdownEls.forEach(el => el.textContent = timerString);
            bannerDayEls.forEach(el => el.textContent = shippingDayText);
            bannerShippingTimeEls.forEach(el => el.textContent = shippingTimeText);

            // Actualizar Contador SecciÃ³n Inferior
            if (hoursEl) hoursEl.textContent = h.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = m.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = s.toString().padStart(2, '0');

            // Actualizar Texto Dinámico Sección Inferior
            if (titleEl && messageEl) {
                const dayText = shippingDayText === 'HOY' ? 'hoy' : 'mañana';
                titleEl.innerHTML = `TU PEDIDO SALE <strong>${shippingDayText}</strong>`;
                messageEl.innerHTML = `
                    Compra antes que termine el contador y tu pedido saldrá 
                    <strong>${dayText} a las ${shippingTimeText}</strong> 
                    con Delivery Express. 🚚💨 <br>
                    <span style="font-size:0.9em; color:#666;">¡Recíbelo volando!</span>
                `;
            }
        }

        updateSmartCountdown();
        setInterval(updateSmartCountdown, 1000);
    }

    init();
    initCountdown();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sll_init_landing);
} else {
    sll_init_landing();
}


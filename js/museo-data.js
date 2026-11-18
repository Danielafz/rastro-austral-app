/**
 * Rastro Austral - Museo Austral 2D
 * js/museo-data.js
 * 
 * Base de datos curada de 6 salas temáticas históricas (18 obras en total)
 * con soporte bilingüe (ES / EN), créditos, hitos territoriales relacionados
 * y fotografías históricas de dominio público.
 */

const SALAS_MUSEO = [
    {
        id: "sala-1",
        numero: 1,
        titulo: {
            es: "Sala 1: Origen del Nombre e Historia",
            en: "Room 1: Origin of the Name & Early History"
        },
        subtitulo: {
            es: "El cruce de Magallanes en 1520 y las hogueras ancestrales",
            en: "Magellan's passage in 1520 and the ancestral fires"
        },
        descripcionCorta: {
            es: "El avistamiento de las fogatas canoeras que bautizaron 'Tierra de los Fuegos' y la primera cartografía austral.",
            en: "The sighting of indigenous fires that christened 'Land of Fire' and early southern cartography."
        },
        icono: "🔥",
        obras: [
            {
                id: "origen-01",
                titulo: {
                    es: "Paso de Hernando de Magallanes (1520)",
                    en: "Passage of Ferdinand Magellan (1520)"
                },
                anio: "1520",
                lugar: {
                    es: "Estrecho de Magallanes",
                    en: "Strait of Magellan"
                },
                descripcion: {
                    es: "En noviembre de 1520, la armada de Hernando de Magallanes halló el ansiado paso interoceánico hacia las islas de las Especias. Al navegar por el estrecho, los marineros divisaron en las costas del sur densas columnas de humo procedentes de las fogatas permanentes de los pueblos originarios, bautizando la región como 'Tierra de los Fuegos'.",
                    en: "In November 1520, Ferdinand Magellan's fleet navigated the interoceanic passage. Gazing south, sailors witnessed enduring smoke columns rising from indigenous hearths, inspiring the name 'Land of Fire'."
                },
                credito: "Retrato y cartografía histórica / Archivo Histórico Nacional (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Ferdinand_Magellan.jpg",
                terminoBusquedaWikimedia: "Ferdinand Magellan portrait",
                hitoRelacionado: {
                    es: "Hito Cabo Espíritu Santo y Estrecho",
                    en: "Cape Espiritu Santo & Strait Landmark"
                }
            },
            {
                id: "origen-02",
                titulo: {
                    es: "Las Hogueras que Bautizaron la Isla",
                    en: "The Bonfires that Named the Island"
                },
                anio: "c. 1520",
                lugar: {
                    es: "Costas del Norte y Canales Fueguinos",
                    en: "Northern Shores and Fuegian Channels"
                },
                descripcion: {
                    es: "Los pueblos canoeros y cazadores terrestres mantenían fuegos perpetuos encendidos día y noche para cocinar, comunicarse mediante señales de humo y mitigar el clima subantártico. Incluso dentro de sus frágiles canoas de corteza transportaban brasas encendidas sobre una cama de barro y arena mojada.",
                    en: "Both terrestrial hunters and seafaring nomads kept perpetual fires burning day and night for warmth, cooking, and smoke signals. Canoeists even carried embers aboard over a clay and wet sand hearth."
                },
                credito: "Grabado náutico de expediciones australes (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Patagonians_and_Fuegians_-_Magellan_Strait.jpg",
                terminoBusquedaWikimedia: "Patagonians and Fuegians Magellan Strait",
                hitoRelacionado: {
                    es: "Cabo San Pablo y Costa Atlántica",
                    en: "Cape San Pablo & Atlantic Coast"
                }
            },
            {
                id: "origen-03",
                titulo: {
                    es: "Cartografía Antigua: Terra Australis Incognita",
                    en: "Ancient Cartography: Terra Australis Incognita"
                },
                anio: "c. 1589",
                lugar: {
                    es: "Confín Austral del Continente Americano",
                    en: "Southern Boundary of the Americas"
                },
                descripcion: {
                    es: "Durante los siglos XVI y XVII, los cartógrafos europeos imaginaban a Tierra del Fuego como la orilla septentrional de un gigantesco continente meridional desconocido. No fue hasta que navegantes como Francis Drake y Schouten y Le Maire doblaron el Cabo de Hornos que se comprendió su carácter insular.",
                    en: "Throughout the 16th and 17th centuries, cartographers envisioned Tierra del Fuego as the northern fringe of a boundless polar landmass until navigators proved it an archipelago bounded by Cape Horn."
                },
                credito: "Abraham Ortelius / Mapoteca Histórica (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Maris_Pacifici_%28Ortelius%2C_1589%29.jpg",
                terminoBusquedaWikimedia: "Abraham Ortelius Maris Pacifici 1589",
                hitoRelacionado: {
                    es: "Paso Garibaldi y Cordillera Fueguina",
                    en: "Garibaldi Pass & Fuegian Mountain Range"
                }
            }
        ]
    },
    {
        id: "sala-2",
        numero: 2,
        titulo: {
            es: "Sala 2: Pueblos Originarios",
            en: "Room 2: Indigenous Peoples"
        },
        subtitulo: {
            es: "Culturas ancestrales Selk'nam, Yámana, Haush y Kawésqar",
            en: "Ancestral Selk'nam, Yámana, Haush & Kawésqar cultures"
        },
        descripcionCorta: {
            es: "Armonía milenaria con los bosques y mares del fin del mundo, canoas de corteza y ceremonias sagradas.",
            en: "Millenary coexistence with southern forests and seas, bark canoes, and sacred ceremonies."
        },
        icono: "🏹",
        obras: [
            {
                id: "indigenas-01",
                titulo: {
                    es: "Cazadores Selk'nam en la Estepa",
                    en: "Selk'nam Hunters in the Steppe"
                },
                anio: "c. 1890 - 1920",
                lugar: {
                    es: "Estepa y Bosques de Río Grande",
                    en: "Steppe & Forests of Río Grande"
                },
                descripcion: {
                    es: "Pueblo nómade pedestre que habitó el norte y centro de la Isla Grande durante más de 10.000 años. Eran consumados arqueros que subsistían de la caza del guanaco y el coruro, resguardándose del gélido viento austral con capas de piel de guanaco (chillami) y toldos de cuero desmontables (kawi).",
                    en: "A pedestrian nomadic people who inhabited northern and central Tierra del Fuego for over 10,000 years. Master bowmen who hunted guanaco and adapted to harsh southerly gales with thick fur mantles."
                },
                credito: "Archivo fotográfico etnográfico / Colección P. Alberto De Agostini (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/6/66/Ona_Selknam.jpg",
                terminoBusquedaWikimedia: "Selknam Ona Tierra del Fuego",
                hitoRelacionado: {
                    es: "Misión Salesiana La Candelaria",
                    en: "La Candelaria Salesian Mission"
                }
            },
            {
                id: "indigenas-02",
                titulo: {
                    es: "Canoeros Yámanas del Canal Beagle",
                    en: "Yámana Canoeists of the Beagle Channel"
                },
                anio: "c. 1882 - 1900",
                lugar: {
                    es: "Canal Beagle e Islas del Sur",
                    en: "Beagle Channel & Southern Archipelago"
                },
                descripcion: {
                    es: "Pueblo marítimo nómade que recorría los canales subantárticos a bordo de canoas de corteza de guindo (anan). Su alimentación se basaba en lobos marinos, mejillones y peces costeros, protegiendo sus cuerpos del frío y el agua salada con grasa animal de foca y ballena.",
                    en: "Nomadic seafaring canoeists who traversed subantarctic channels in beech bark canoes (anan). They harvested sea lions, mussels, and fish, shielding their skin with seal grease."
                },
                credito: "Mission Scientifique du Cap Horn (1882-1883) (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Chile%2C_Yaghan_%28Yamana%29_canoe%2C_model_in_the_Vatican_Museums.jpg",
                terminoBusquedaWikimedia: "Yamana Yaghan canoe Beagle",
                hitoRelacionado: {
                    es: "Parque Nacional Tierra del Fuego",
                    en: "Tierra del Fuego National Park"
                }
            },
            {
                id: "indigenas-03",
                titulo: {
                    es: "La Ceremonia Sagrada del Hain",
                    en: "The Sacred Hain Ceremony"
                },
                anio: "c. 1923",
                lugar: {
                    es: "Bosques Centrales de Tierra del Fuego",
                    en: "Central Forests of Tierra del Fuego"
                },
                descripcion: {
                    es: "El Hain era el rito más trascendental de la sociedad Selk'nam. En él, los jóvenes postulantes (klóketen) eran instruidos en la cosmovisión, mitología y supervivencia, mientras los iniciados encarnaban a los espíritus del bosque con máscaras de corteza y elaboradas pinturas corporales geométricas.",
                    en: "The Hain was the most revered rite of Selk'nam spiritual life. Candidates (klóketen) were initiated into tribal cosmology, with elders impersonating forest spirits using bark masks and geometric body paint."
                },
                credito: "Registro documental del Dr. Martin Gusinde (1923) (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Ona_%281938%29.JPG",
                terminoBusquedaWikimedia: "Selknam Hain ceremony",
                hitoRelacionado: {
                    es: "Reserva Provincial Corazón de la Isla",
                    en: "Heart of the Island Provincial Reserve"
                }
            }
        ]
    },
    {
        id: "sala-3",
        numero: 3,
        titulo: {
            es: "Sala 3: Expediciones y Naufragios",
            en: "Room 3: Expeditions & Shipwrecks"
        },
        subtitulo: {
            es: "El HMS Beagle, Charles Darwin y el Faro del Fin del Mundo",
            en: "HMS Beagle, Charles Darwin & the Lighthouse at the End of the World"
        },
        descripcionCorta: {
            es: "Hazañas hidrográficas, tempestades en el Cabo de Hornos y faros centinelas del Atlántico Sur.",
            en: "Hydrographic feats, roaring storms around Cape Horn, and sentinel lighthouses of the South Atlantic."
        },
        icono: "⛵",
        obras: [
            {
                id: "navegantes-01",
                titulo: {
                    es: "El HMS Beagle y Charles Darwin (1832)",
                    en: "HMS Beagle & Charles Darwin (1832)"
                },
                anio: "1832 - 1834",
                lugar: {
                    es: "Canal Beagle y Glaciar Holanda",
                    en: "Beagle Channel & Holland Glacier"
                },
                descripcion: {
                    es: "Bajo el mando del capitán Robert FitzRoy, el bergantín HMS Beagle cartografió minuciosamente los canales fueguinos. El joven naturalista Charles Darwin desembarcó en estas costas estudiando glaciares, fósiles, fauna y flora fueguina, recolectando evidencias cruciales para el desarrollo de la teoría de la evolución.",
                    en: "Commanded by Capt. Robert FitzRoy, HMS Beagle surveyed Fuegian waterways. Aboard was young naturalist Charles Darwin, whose observations of local glaciers, wildlife, and geology shaped the Theory of Evolution."
                },
                credito: "Acuarela de Conrad Martens (1832) / National Maritime Museum (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/2/22/HMS_Beagle_by_Conrad_Martens.jpg",
                terminoBusquedaWikimedia: "HMS Beagle Conrad Martens",
                hitoRelacionado: {
                    es: "Faro Les Éclaireurs y Canal Beagle",
                    en: "Les Éclaireurs Lighthouse & Beagle Channel"
                }
            },
            {
                id: "navegantes-02",
                titulo: {
                    es: "Faro San Juan de Salvamento (Fin del Mundo)",
                    en: "San Juan de Salvamento Lighthouse (End of the World)"
                },
                anio: "1884",
                lugar: {
                    es: "Isla de los Estados",
                    en: "Staten Island (Isla de los Estados)"
                },
                descripcion: {
                    es: "Inaugurado el 25 de mayo de 1884 por la expedición argentina del comodoro Augusto Lasserre en la agreste Isla de los Estados. Su singular torre octogonal de madera irradiaba luz para salvaguardar a los buques que desafiaban el Cabo de Hornos, inmortalizado por Julio Verne en su célebre novela.",
                    en: "Inaugurated on May 25, 1884, by Argentine Commodore Augusto Lasserre on rugged Staten Island. Its octagonal wooden tower guided sailing vessels navigating Cape Horn, inspiring Jules Verne's famous novel."
                },
                credito: "Archivo Histórico de la Armada Argentina (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/ARA_Estrecho_de_San_Carlos_y_Faro_del_Fin_del_Mundo.jpg",
                terminoBusquedaWikimedia: "Faro San Juan de Salvamento",
                hitoRelacionado: {
                    es: "Faro Les Éclaireurs",
                    en: "Les Éclaireurs Lighthouse"
                }
            },
            {
                id: "navegantes-03",
                titulo: {
                    es: "Naufragios en el Estrecho de Le Maire",
                    en: "Shipwrecks at Le Maire Strait"
                },
                anio: "Siglos XIX y XX",
                lugar: {
                    es: "Cabo San Pablo y Estrecho de Le Maire",
                    en: "Cape San Pablo & Le Maire Strait"
                },
                descripcion: {
                    es: "Considerado uno de los pasos oceánicos más temidos del planeta por sus corrientes encontradas, olas gigantes y vientos antárticos. Cientos de veleros mercantes hallaron su final en estas costas; testimonios vivos como el buque motor Desdémona (varado en 1985) custodian las restingas fueguinas.",
                    en: "Feared by sailors worldwide for cross-currents, towering swells, and williwaw winds. Hundreds of clippers met their fate here; shipwrecks like the Desdémona still rest on the Atlantic reefs."
                },
                credito: "Colección Fotográfica Histórica Austral / AGN (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/3/37/FMIB_47233_HMS_Beagle_in_Straits_of_Magellan_Mt_Sarmiento_in_the_Distance.jpeg",
                terminoBusquedaWikimedia: "HMS Beagle Straits of Magellan Mt Sarmiento",
                hitoRelacionado: {
                    es: "Barco Varado Desdémona (Cabo San Pablo)",
                    en: "Desdémona Shipwreck (Cape San Pablo)"
                }
            }
        ]
    },
    {
        id: "sala-4",
        numero: 4,
        titulo: {
            es: "Sala 4: Pioneros, Estancias y Oro",
            en: "Room 4: Pioneers, Ranches & Gold Rush"
        },
        subtitulo: {
            es: "La fiebre del oro, la Misión Salesiana y Estancia Harberton",
            en: "The gold rush, Salesian Mission & Harberton Ranch"
        },
        descripcionCorta: {
            es: "Los buscadores de oro de El Páramo, la fundación salesiana de Río Grande y los pioneros ganaderos.",
            en: "The El Páramo gold diggers, the Salesian founding of Río Grande, and pastoral sheep pioneers."
        },
        icono: "🪙",
        obras: [
            {
                id: "pioneros-01",
                titulo: {
                    es: "Fiebre del Oro en El Páramo (Julio Popper)",
                    en: "Gold Rush at El Páramo (Julio Popper)"
                },
                anio: "1886",
                lugar: {
                    es: "Península El Páramo, Bahía San Sebastián",
                    en: "El Páramo Peninsula, San Sebastián Bay"
                },
                descripcion: {
                    es: "Hacia 1886, el ingeniero rumano nacionalizado argentino Julio Popper lideró expediciones para extraer oro de las arenas litorales de Bahía San Sebastián. Popper erigió un establecimiento minero, acuñó monedas de oro propias reconocidas en Buenos Aires y emitió estampillas territoriales.",
                    en: "In 1886, Romanian-Argentine engineer Julio Popper led mining expeditions extracting gold dust from shoreline sands. He established camps, minted territorial gold coins, and printed local postage stamps."
                },
                credito: "Fototeca del Museo del Fin del Mundo / Colección Popper (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Julio_Popper.jpg",
                terminoBusquedaWikimedia: "Julio Popper Tierra del Fuego",
                hitoRelacionado: {
                    es: "Bahía San Sebastián y El Páramo",
                    en: "San Sebastián Bay & El Páramo"
                }
            },
            {
                id: "pioneros-02",
                titulo: {
                    es: "Misión Salesiana La Candelaria",
                    en: "La Candelaria Salesian Mission"
                },
                anio: "1893",
                lugar: {
                    es: "Río Grande, Norte Fueguino",
                    en: "Río Grande, Northern Tierra del Fuego"
                },
                descripcion: {
                    es: "Fundada por Monseñor José Fagnano en 1893 junto al río Chico de Río Grande, la misión incluyó talleres de carpintería, telar, escuela agrícola y templo. Constituyó el núcleo fundacional que dio origen al desarrollo agrícola, social y urbano de la zona norte de la provincia.",
                    en: "Founded by Msgr. José Fagnano in 1893 near Río Grande. The mission featured carpentry shops, an agricultural school, and a chapel, planting the seed for the town's social and community development."
                },
                credito: "Archivo Histórico Salesiano de la Patagonia (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/8/86/Primera_Casa_Misi%C3%B3n_Salesiana_en_R%C3%ADo_Grande%2C_Tierra_del_Fuego_-_Los_Shelknam_%28page_77_crop%29.jpg",
                terminoBusquedaWikimedia: "Mision Salesiana Rio Grande Tierra del Fuego",
                hitoRelacionado: {
                    es: "Misión Salesiana Nuestra Señora de la Candelaria",
                    en: "Our Lady of La Candelaria Salesian Mission"
                }
            },
            {
                id: "pioneros-03",
                titulo: {
                    es: "Estancia Harberton: Primera en la Isla",
                    en: "Harberton Ranch: First on the Island"
                },
                anio: "1886",
                lugar: {
                    es: "Costa Sur del Canal Beagle",
                    en: "South Shore of Beagle Channel"
                },
                descripcion: {
                    es: "Establecida en 1886 por el reverendo Thomas Bridges y su familia sobre tierras concedidas por el Congreso Nacional Argentino en reconocimiento a su labor humanitaria y a la compilación del colosal diccionario Yámana-Inglés de más de 30.000 vocablos.",
                    en: "Founded in 1886 by Rev. Thomas Bridges on land granted by the Argentine Congress in honor of his humanitarian dedication and his 30,000-word Yámana-English dictionary."
                },
                credito: "Colección Fotográfica Familia Bridges (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Estancia_Harberton_001.JPG",
                terminoBusquedaWikimedia: "Estancia Harberton Tierra del Fuego",
                hitoRelacionado: {
                    es: "Estancia Harberton y Museo Acatushún",
                    en: "Harberton Ranch & Acatushún Museum"
                }
            }
        ]
    },
    {
        id: "sala-5",
        numero: 5,
        titulo: {
            es: "Sala 5: Ushuaia, Presidio y Antártida",
            en: "Room 5: Ushuaia, Prison & Antarctica"
        },
        subtitulo: {
            es: "El Presidio de Reincidentes, el Ferrocarril y la Puerta Antártica",
            en: "The Repeat Offenders Prison, Railway & Antarctic Gateway"
        },
        descripcionCorta: {
            es: "La colonia penal que levantó la capital fueguina, el Tren de los Presos y el puente histórico al Continente Blanco.",
            en: "The penal colony that built Ushuaia, the Prisoners' Train, and the historic gateway to the White Continent."
        },
        icono: "🏔️",
        obras: [
            {
                id: "ushuaia-01",
                titulo: {
                    es: "Presidio de Reincidentes de Ushuaia",
                    en: "Ushuaia Prison of Repeat Offenders"
                },
                anio: "1902 - 1947",
                lugar: {
                    es: "Ushuaia, Tierra del Fuego",
                    en: "Ushuaia, Tierra del Fuego"
                },
                descripcion: {
                    es: "Emplazado a principios del siglo XX con cinco pabellones radiales de piedra construidos por los propios presidiarios. La colonia penal garantizó la soberanía territorial en el extremo austral, dotando al pueblo de su primera imprenta, hospital, telégrafo, muelle y alumbrado eléctrico.",
                    en: "Built at the dawn of the 20th century with five stone pavilions erected by the convicts themselves. The penal colony secured southern sovereignty and provided Ushuaia's early printing press, hospital, and electric grid."
                },
                credito: "Archivo General de la Nación (AGN) (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Museo_Maritimo_y_Ex_Presidio_de_Ushuaia_01.JPG",
                terminoBusquedaWikimedia: "Presidio Ushuaia",
                hitoRelacionado: {
                    es: "Presidio de Ushuaia y Museo Marítimo",
                    en: "Ushuaia Prison & Maritime Museum"
                }
            },
            {
                id: "ushuaia-02",
                titulo: {
                    es: "El Ferrocarril Austral Fueguino ('Tren de los Presos')",
                    en: "Southern Fuegian Railway ('Prisoners Train')"
                },
                anio: "c. 1910",
                lugar: {
                    es: "Monte Susana y Cañadón del Río Pipo",
                    en: "Mount Susana & Pipo River Canyon"
                },
                descripcion: {
                    es: "El tren a vapor de trocha angosta (Decauville) que partía desde el presidio hacia los espesos bosques de lenga del monte Susana. Transportaba leña, arena y piedras para construir las viviendas públicas y alimentar las calderas de la pequeña Ushuaia, hoy reconvertido en el emblemático Tren del Fin del Mundo.",
                    en: "A narrow-gauge steam train connecting the prison with native lenga forests along Mount Susana. It carried firewood, gravel, and timber to heat homes and build early Ushuaia, reborn today as the End of the World Train."
                },
                credito: "Archivo Fotográfico Ferroviario / AGN (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/7/72/El_Tren_del_Fin_del_Mundo.jpg",
                terminoBusquedaWikimedia: "Tren del Fin del Mundo Ushuaia",
                hitoRelacionado: {
                    es: "Estación del Tren del Fin del Mundo",
                    en: "End of the World Train Station"
                }
            },
            {
                id: "ushuaia-03",
                titulo: {
                    es: "Ushuaia: Centinela y Puerta a la Antártida",
                    en: "Ushuaia: Sentinel & Antarctic Gateway"
                },
                anio: "1900 - 1904",
                lugar: {
                    es: "Bahía de Ushuaia y Continente Blanco",
                    en: "Ushuaia Bay & White Continent"
                },
                descripcion: {
                    es: "Por su cercanía geográfica de apenas 1.000 km a la Península Antártica, Ushuaia se consolidó como el puerto logístico por excelencia para las expediciones polares internacionales (Gerlache, Charcot, Nordenskjöld). En 1904, Argentina fundó la Base Orcadas, inaugurando la presencia ininterrumpida más antigua en la Antártida.",
                    en: "Located merely 1,000 km from the Antarctic Peninsula, Ushuaia became the foremost staging harbor for polar expeditions. In 1904, Argentina opened Orcadas Base, marking the longest continuous human presence in Antarctica."
                },
                credito: "Fototeca Histórica Antártica Argentina / AGN (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Ushuaia_tdf_agn_1900.jpg",
                terminoBusquedaWikimedia: "Ushuaia tdf agn 1900",
                hitoRelacionado: {
                    es: "Puerto de Ushuaia y Cartel del Fin del Mundo",
                    en: "Ushuaia Port & End of the World Signpost"
                }
            }
        ]
    },
    {
        id: "sala-6",
        numero: 6,
        titulo: {
            es: "Sala 6: Islas Malvinas",
            en: "Room 6: Falkland / Malvinas Islands"
        },
        subtitulo: {
            es: "Historia, soberanía y memoria permanente del Atlántico Sur",
            en: "History, sovereignty & enduring South Atlantic memory"
        },
        descripcionCorta: {
            es: "Cartografía virreinal, Puerto Soledad, la resistencia de 1833 y el homenaje a los héroes de 1982.",
            en: "Colonial cartography, Puerto Soledad, 1833 resistance, and tribute to 1982 heroes."
        },
        icono: "🇦🇷",
        obras: [
            {
                id: "malvinas-01",
                titulo: {
                    es: "Cartografía Histórica del Atlántico Sur",
                    en: "Historical Cartography of the South Atlantic"
                },
                anio: "1764 - 1820",
                lugar: {
                    es: "Archipiélago de las Islas Malvinas",
                    en: "Falkland / Malvinas Islands Archipelago"
                },
                descripcion: {
                    es: "Primeros mapas y registros cartográficos históricos del archipiélago austroamericano. La cartografía colonial y virreinal atestigua la presencia y soberanía territorial sobre las islas desde la fundación de Puerto Soledad y la toma de posesión formal por David Jewett en 1820 en nombre de las Provincias Unidas del Río de la Plata.",
                    en: "Early historical maps and cartographic registers of the southern archipelago. Colonial and republican charts document the territorial administration and the formal act of sovereignty conducted by David Jewett in 1820 on behalf of the United Provinces of the Río de la Plata."
                },
                credito: "Mapoteca Histórica del Archivo General de la Nación (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Puerto_Soledad%2C_Malvinas%2C_1785.jpg",
                terminoBusquedaWikimedia: "Puerto Soledad Malvinas 1785",
                hitoRelacionado: {
                    es: "Plaza Malvinas e Identidad Provincial",
                    en: "Malvinas Square & Provincial Identity"
                }
            },
            {
                id: "malvinas-02",
                titulo: {
                    es: "Comandancia Política y Militar de Malvinas",
                    en: "Political and Military Command of Malvinas"
                },
                anio: "1829",
                lugar: {
                    es: "Puerto Soledad, Isla Soledad",
                    en: "Puerto Soledad, East Falkland"
                },
                descripcion: {
                    es: "El 10 de junio de 1829, el gobierno de Buenos Aires creó por decreto la Comandancia Política y Militar de las Islas Malvinas y adyacentes al Cabo de Hornos, designando a Luis Vernet como gobernador. Desde Puerto Soledad se ejerció la administración de justicia, regulación pesquera y fomento de la cría de ganado criollo.",
                    en: "On June 10, 1829, the government of Buenos Aires created by decree the Political and Military Command of the Malvinas Islands and adjacent waters to Cape Horn, naming Luis Vernet as governor to administer civil law, fisheries, and pastoral development."
                },
                credito: "Retrato Histórico de Luis Vernet / Archivo General de la Nación (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Vernet_Luis_Portrait.jpg",
                terminoBusquedaWikimedia: "Luis Vernet Malvinas portrait",
                hitoRelacionado: {
                    es: "Monumento a los Pioneros Fueguinos",
                    en: "Fuegian Pioneers Monument"
                }
            },
            {
                id: "malvinas-03",
                titulo: {
                    es: "Resistencia de 1833 y el Gaucho Antonio Rivero",
                    en: "1833 Resistance & Gaucho Antonio Rivero"
                },
                anio: "1833",
                lugar: {
                    es: "Puerto Luis / Puerto Soledad, Isla Soledad",
                    en: "Port Louis / Puerto Soledad, East Falkland"
                },
                descripcion: {
                    es: "Tras la ocupación forzada británica de enero de 1833, el gaucho entrerriano Antonio Rivero encabezó el 26 de agosto una rebelión criolla en Puerto Soledad junto a un grupo de peones y gauchos, izando el pabellón argentino y resistiendo el despojo colonial en defensa de los derechos soberanos sobre las islas.",
                    en: "Following the forcible British occupation of January 1833, Argentine gaucho Antonio Rivero led a rebellion on August 26 in Puerto Soledad alongside fellow gauchos and workers, raising the Argentine flag and resisting colonial dispossession in defense of sovereign rights."
                },
                credito: "Pintura Histórica del Gaucho Rivero / Colección del Museo Malvinas (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/7/75/Gaucho_Rivero_pintura.jpg",
                terminoBusquedaWikimedia: "Gaucho Rivero pintura",
                hitoRelacionado: {
                    es: "Monumento a los Héroes de Malvinas (Río Grande)",
                    en: "Malvinas Heroes Monument (Río Grande)"
                }
            },
            {
                id: "malvinas-04",
                titulo: {
                    es: "Conflicto del Atlántico Sur",
                    en: "South Atlantic Conflict"
                },
                anio: "1982",
                lugar: {
                    es: "Tierra del Fuego y Atlántico Sur",
                    en: "Tierra del Fuego & South Atlantic"
                },
                descripcion: {
                    es: "El archipiélago malvinense y el Atlántico Sur fueron escenario de la gesta de 1982. Tierra del Fuego cumplió un papel estratégico vital como plataforma aeronaval y logística. La provincia mantiene el homenaje constante a los combatientes y veteranos que defendieron con honor la soberanía territorial.",
                    en: "The Malvinas archipelago and South Atlantic waters were the scene of the 1982 conflict. Tierra del Fuego fulfilled a crucial operational role as an air-naval base and staging territory, preserving an enduring tribute to all veterans and fallen combatants."
                },
                credito: "Mural Escultórico Héroes de Malvinas / Archivo Histórico Provincial (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Mural_escult%C3%B3rico_H%C3%A9roes_de_Malvinas_II.jpg",
                terminoBusquedaWikimedia: "Mural Heroes de Malvinas",
                hitoRelacionado: {
                    es: "Monumento a los Héroes de Malvinas (Río Grande)",
                    en: "Malvinas Heroes Monument (Río Grande)"
                }
            },
            {
                id: "malvinas-05",
                titulo: {
                    es: "Plaza Islas Malvinas y Monumento a los Caídos en Ushuaia",
                    en: "Islas Malvinas Square & Fallen Soldiers Memorial in Ushuaia"
                },
                anio: "1994",
                lugar: {
                    es: "Costanera de Ushuaia, Canal Beagle",
                    en: "Ushuaia Waterfront, Beagle Channel"
                },
                descripcion: {
                    es: "Emblemático espacio de memoria y soberanía sobre la costanera de Ushuaia frente al Canal Beagle. Alberga el Monumento Nacional a los Caídos, el cenotafio con los nombres de los 649 héroes argentinos que dieron su vida en 1982 y la llama votiva eterna que arde de forma perpetua.",
                    en: "Iconic commemorative site on Ushuaia's shoreline facing the Beagle Channel. It features the National Fallen Soldiers Memorial, the cenotaph inscribed with the 649 names of Argentine heroes fallen in 1982, and an eternal flame burning perpetually."
                },
                credito: "Plaza Islas Malvinas, Ushuaia / Wikimedia Commons (CC BY-SA)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Plaza_Islas_Malvinas%2C_Ushuaia.jpg",
                terminoBusquedaWikimedia: "Plaza Islas Malvinas Ushuaia",
                hitoRelacionado: {
                    es: "Plaza Islas Malvinas (Ushuaia)",
                    en: "Plaza Islas Malvinas (Ushuaia)"
                }
            }
        ]
    },
    {
        id: "sala-7",
        numero: 7,
        titulo: {
            es: "Sala 7: Flora Fueguina y Bosques Subantárticos",
            en: "Room 7: Fuegian Flora & Subantarctic Forests"
        },
        subtitulo: {
            es: "Lenga, ñire, guindo, sotobosque de calafate y praderas de cachiyuyo",
            en: "Lenga, ñire, Magellan's beech, calafate shrub and giant kelp forests"
        },
        descripcionCorta: {
            es: "El bosque caducifolio más austral del mundo y las praderas submarinas del Canal Beagle.",
            en: "The southernmost deciduous forest on Earth and Beagle Channel's kelp beds."
        },
        icono: "🌿",
        obras: [
            {
                id: "flora-01",
                titulo: {
                    es: "Bosques de Lenga, Guindo y Ñire",
                    en: "Lenga, Guindo & Ñire Subantarctic Forests"
                },
                anio: "Vegetación Autóctona",
                lugar: {
                    es: "Parque Nacional Tierra del Fuego",
                    en: "Tierra del Fuego National Park"
                },
                descripcion: {
                    es: "Los bosques andino-patagónicos de Nothofagus pumilio (lenga), Nothofagus betuloides (guindo) y Nothofagus antarctica (ñire) forman la masa forestal caducifolia más austral del planeta. En otoño tiñen las laderas de los Andes fueguinos de intensos tonos escarlata, ocre y dorado.",
                    en: "The Fuegian subantarctic forests of Nothofagus pumilio (lenga), Nothofagus betuloides (Magellan's beech), and Nothofagus antarctica (ñire) represent the southernmost deciduous forest on Earth, turning mountain slopes into breathtaking scarlet and gold during autumn."
                },
                credito: "Bosque de Lenga / Wikimedia Commons (CC BY-SA)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c4/TDFNPLengaForest.jpg",
                terminoBusquedaWikimedia: "Nothofagus pumilio Tierra del Fuego",
                hitoRelacionado: {
                    es: "Parque Nacional Tierra del Fuego",
                    en: "Tierra del Fuego National Park"
                }
            },
            {
                id: "flora-02",
                titulo: {
                    es: "El Calafate y Sotobosque Patagónico",
                    en: "Calafate & Patagonian Understory"
                },
                anio: "Flora Silvestre Fueguina",
                lugar: {
                    es: "Estepa y Bosques Fueguinos",
                    en: "Fuegian Steppe & Forests"
                },
                descripcion: {
                    es: "El calafate (Berberis microphylla) es el arbusto espinoso símbolo de la Patagonia austral. Sus bayas de color azul oscuro, ricas en antioxidantes, fueron alimento esencial de los pueblos Selk'nam y Yámana. La tradición popular sostiene que 'quien come calafate, siempre regresa a la Tierra del Fuego'.",
                    en: "The calafate (Berberis microphylla) is an iconic thorny shrub of southern Patagonia. Its antioxidant-rich dark blue berries were vital food for the Selk'nam and Yámana peoples. Local folklore says that whoever eats a calafate berry will inevitably return to Tierra del Fuego."
                },
                credito: "Calafate en fruto / Wikimedia Commons (CC BY-SA)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Calafate_%28Berberis_Microphylla%29.JPG",
                terminoBusquedaWikimedia: "Berberis microphylla calafate",
                hitoRelacionado: {
                    es: "Sendero de la Costa y Bahía Lapataia",
                    en: "Coastal Trail & Lapataia Bay"
                }
            },
            {
                id: "flora-03",
                titulo: {
                    es: "Bosques Submarinos de Cachiyuyo",
                    en: "Giant Kelp Subsea Forests"
                },
                anio: "Ecosistema Marino Austral",
                lugar: {
                    es: "Canal Beagle y Costas del Atlántico Sur",
                    en: "Beagle Channel & South Atlantic Coasts"
                },
                descripcion: {
                    es: "Las algas gigantes de cachiyuyo (Macrocystis pyrifera) forman densas selvas submarinas de hasta 30 metros de altura en las aguas gélidas del Canal Beagle. Amortiguan el oleaje oceánico, absorben enormes volúmenes de dióxido de carbono y constituyen la guardería vital de centollas, caracoles, erizos y peces australes.",
                    en: "Giant kelp (Macrocystis pyrifera) groves form towering underwater forests up to 30 meters high in the frigid waters of Beagle Channel. They buffer ocean swell, capture substantial carbon, and serve as nursery habitat for king crabs, sea urchins, and subantarctic fish."
                },
                credito: "Bosque de Macrocystis pyrifera en Canal Beagle / Wikimedia Commons (CC BY-SA)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/5/58/Macrocystis_pyrifera_kelp_forest.jpg",
                terminoBusquedaWikimedia: "Macrocystis pyrifera kelp forest",
                hitoRelacionado: {
                    es: "Faro Les Éclaireurs y Canal Beagle",
                    en: "Les Éclaireurs Lighthouse & Beagle Channel"
                }
            }
        ]
    },
    {
        id: "sala-8",
        numero: 8,
        titulo: {
            es: "Sala 8: Fauna Austral y Santuario Marino",
            en: "Room 8: Southern Wildlife & Marine Sanctuary"
        },
        subtitulo: {
            es: "Pingüinos rey, guanacos de la estepa, lobos marinos y aves del Beagle",
            en: "King penguins, steppe guanacos, sea lions and Beagle seabirds"
        },
        descripcionCorta: {
            es: "La biodiversidad animal que habita las aguas gélidas y los llanos fueguinos.",
            en: "Animal biodiversity thriving across Fuegian steppes and subantarctic waters."
        },
        icono: "🐧",
        obras: [
            {
                id: "fauna-01",
                titulo: {
                    es: "Pingüinos Rey, Magallánicos y de Penacho Amarillo",
                    en: "King, Magellanic & Rockhopper Penguins"
                },
                anio: "Fauna Silvestre Protegida",
                lugar: {
                    es: "Isla Martillo e Islas del Atlántico Sur",
                    en: "Martillo Island & South Atlantic Islands"
                },
                descripcion: {
                    es: "La colonia de Isla Martillo en el Canal Beagle es el único apostadero reproductivo accesible en territorio continental argentino de pingüinos de Magallanes (Spheniscus magellanicus), papúa (Pygoscelis papua) y ejemplares de pingüino rey (Aptenodytes patagonicus) y de penacho amarillo.",
                    en: "Martillo Island in the Beagle Channel is the only accessible breeding colony in Argentine territory where Magellanic (Spheniscus magellanicus) and Gentoo (Pygoscelis papua) penguins nest alongside occasional king and rockhopper penguins."
                },
                credito: "Pingüino Rey en Isla Martillo / Wikimedia Commons (CC BY-SA)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/b/be/Aptenodytes_patagonicus_-Falkland_Islands-8.jpg",
                terminoBusquedaWikimedia: "Aptenodytes patagonicus king penguin",
                hitoRelacionado: {
                    es: "Isla Martillo - Pingüinera",
                    en: "Martillo Island - Penguin Rookery"
                }
            },
            {
                id: "fauna-02",
                titulo: {
                    es: "Guanacos Fueguinos de la Estepa y el Bosque",
                    en: "Fuegian Guanacos of Steppe & Forest"
                },
                anio: "Mamífero Autóctono Emblemático",
                lugar: {
                    es: "Estepa Norte y Cordillera Fueguina",
                    en: "Northern Steppe & Fuegian Range"
                },
                descripcion: {
                    es: "El guanaco (Lama guanicoe) es el mayor herbívoro nativo de la Isla Grande de Tierra del Fuego. Adaptado a inviernos rigurosos con pelaje denso y patas acolchadas que no erosionan los suelos frágiles, fue el pilar fundamental de la subsistencia del pueblo Selk'nam para abrigo, vivienda y alimento.",
                    en: "The guanaco (Lama guanicoe) is the largest native herbivore of Tierra del Fuego. Adapted to severe subantarctic winters with insulating wool and soft-padded feet that preserve delicate soils, it was the cornerstone of Selk'nam culture for shelter, clothing, and sustenance."
                },
                credito: "Guanaco corriendo en Tierra del Fuego / Wikimedia Commons (CC BY-SA)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Running_Guanaco_Tierra_del_Fuego_Chile.jpg",
                terminoBusquedaWikimedia: "Lama guanicoe Tierra del Fuego",
                hitoRelacionado: {
                    es: "Reserva Costa Atlántica (Río Grande)",
                    en: "Atlantic Coastal Reserve (Río Grande)"
                }
            },
            {
                id: "fauna-03",
                titulo: {
                    es: "Lobos Marinos, Cormoranes y Albatros del Canal Beagle",
                    en: "Sea Lions, Cormorants & Albatrosses of Beagle Channel"
                },
                anio: "Santuario Marino Austral",
                lugar: {
                    es: "Isla de los Lobos e Isla de los Pájaros, Canal Beagle",
                    en: "Isla de los Lobos & Isla de los Pájaros, Beagle Channel"
                },
                descripcion: {
                    es: "Los islotes rocosos del Canal Beagle albergan colonias densas de lobos marinos de un pelo (Otaria flavescens) y de dos pelos (Arctocephalus australis), junto a miles de cormoranes imperiales y de cuello negro. Sobre sus aguas planean majestuosos albatros de ceja negra procedentes del Océano Austral.",
                    en: "Rocky islets across the Beagle Channel harbor breeding rookeries of South American sea lions (Otaria flavescens) and fur seals (Arctocephalus australis), alongside nesting imperial and rock cormorants, framed by soaring black-browed albatrosses."
                },
                credito: "Lobos Marinos en el Canal Beagle / Wikimedia Commons (CC BY-SA)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/Beagle_Channel_-_La_Isla_de_Los_Lobos.jpg",
                terminoBusquedaWikimedia: "Beagle Channel La Isla de Los Lobos",
                hitoRelacionado: {
                    es: "Faro Les Éclaireurs y Canal Beagle",
                    en: "Les Éclaireurs Lighthouse & Beagle Channel"
                }
            }
        ]
    },
    {
        id: "sala-9",
        numero: 9,
        titulo: {
            es: "Sala 9: Ecosistemas: Turbales, Glaciares y Relieve",
            en: "Room 9: Ecosystems: Peatlands, Glaciers & Landforms"
        },
        subtitulo: {
            es: "Turbales de Sphagnum, glaciares milenarios y ríos de piedra",
            en: "Sphagnum peatlands, ancient glaciers and periglacial stone runs"
        },
        descripcionCorta: {
            es: "Los reservorios hídricos, reguladores del clima y geoformas cuaternarias del confín austral.",
            en: "Water reservoirs, climate stabilizers, and quaternary landforms of the southern tip."
        },
        icono: "🏔️",
        obras: [
            {
                id: "ecosistema-01",
                titulo: {
                    es: "Turbales Milenarios de Musgo Sphagnum",
                    en: "Ancient Sphagnum Peat Bogs"
                },
                anio: "Humedal Holoceno (10.000 Años)",
                lugar: {
                    es: "Valle de Andorra y Cuencas Fueguinas",
                    en: "Andorra Valley & Fuegian Basins"
                },
                descripcion: {
                    es: "Los turbales de musgo Sphagnum magellanicum cubren más de 2.700 km² en Tierra del Fuego, constituyendo el 95% de las turberas de Argentina. Actúan como gigantescas esponjas naturales que filtran y regulan el agua dulce hacia las ciudades y capturan carbono atmosférico a escala global.",
                    en: "Sphagnum magellanicum peat bogs span over 2,700 km² across Tierra del Fuego, comprising 95% of Argentina's peatlands. They function as massive natural sponges regulating freshwater and storing exceptional amounts of terrestrial carbon."
                },
                credito: "Turbal en Valle de Andorra, Ushuaia / Wikimedia Commons (CC BY-SA)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sphagnum_bog_Tierra_del_Fuego.jpg",
                terminoBusquedaWikimedia: "Sphagnum bog Tierra del Fuego",
                hitoRelacionado: {
                    es: "Sitio Ramsar Glaciar Vinciguerra y Turbales de Andorra",
                    en: "Vinciguerra Glacier & Andorra Peatlands Ramsar Site"
                }
            },
            {
                id: "ecosistema-02",
                titulo: {
                    es: "Glaciares Martial y Vinciguerra",
                    en: "Martial & Vinciguerra Glaciers"
                },
                anio: "Relicto Glaciario Andino",
                lugar: {
                    es: "Cordillera Alvear y Montes Martial",
                    en: "Alvear Range & Martial Mountains"
                },
                descripcion: {
                    es: "Los glaciares de circo Martial y Vinciguerra coronan las cumbres que rodean a Ushuaia. Como fuentes primarias de agua de deshielo para consumo urbano y modeladores de lagunas glaciarias como la Laguna Esmeralda y Laguna del Caminante, son centinelas directos del cambio climático global en el extremo sur.",
                    en: "Martial and Vinciguerra cirque glaciers crown the alpine ranges above Ushuaia. As critical headwaters supplying municipal drinking water and sculpting turquoise tarns like Laguna Esmeralda, they serve as vital barometers of global climate dynamics."
                },
                credito: "Glaciar Martial en Ushuaia / Wikimedia Commons (CC BY-SA)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Glaciar_Martial_Ushuaia.jpg",
                terminoBusquedaWikimedia: "Glaciar Martial Ushuaia",
                hitoRelacionado: {
                    es: "Glaciar Martial",
                    en: "Glaciar Martial"
                }
            },
            {
                id: "ecosistema-03",
                titulo: {
                    es: "Ríos de Piedra (Stone Runs) y Relieve Periglaciar",
                    en: "Stone Runs & Periglacial Landforms"
                },
                anio: "Geoforma Cuaternaria",
                lugar: {
                    es: "Extremo Austral e Islas Malvinas",
                    en: "Southern Tip & Falkland / Malvinas Islands"
                },
                descripcion: {
                    es: "Formaciones geológicas periglaciares originadas durante los ciclos de congelamiento y deshielo del Pleistoceno. Bloques angulares de cuarcita y roca dura forman verdaderas corrientes de roca estables que descienden por las laderas, hermanando el relieve de las Islas Malvinas con los cordones montañosos de Tierra del Fuego.",
                    en: "Periglacial stone runs formed by intensive frost-shattering and solifluction during Pleistocene glacial cycles. Immense streams of quartzite boulders cascade across valley floors, linking the geomorphology of the Malvinas archipelago with Fuegian mountain chains."
                },
                credito: "Ríos de Piedra (Stone Run) / Wikimedia Commons (CC BY-SA)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/East_Falkland_-_Stone_Run.jpg",
                terminoBusquedaWikimedia: "East Falkland Stone Run",
                hitoRelacionado: {
                    es: "Reserva Geológica y Paleontológica Austral",
                    en: "Southern Geological & Paleontological Reserve"
                }
            }
        ]
    }
];

// Fallback visual en SVG para obras si se visualizan offline sin imagen previa en caché
function generarSvgFallbackObra(titulo, anio) {
    const tituloEsc = (titulo || "Obra Histórica").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const anioEsc = (anio || "Patrimonio Fueguino").replace(/&/g, "&amp;").replace(/</g, "&lt;");
    
    return "data:image/svg+xml;utf8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
            <defs>
                <linearGradient id="papel" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#2D1F17"/>
                    <stop offset="50%" stop-color="#1E140E"/>
                    <stop offset="100%" stop-color="#120B07"/>
                </linearGradient>
                <linearGradient id="bronce" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#C59B27"/>
                    <stop offset="50%" stop-color="#E5C158"/>
                    <stop offset="100%" stop-color="#9A7718"/>
                </linearGradient>
            </defs>
            <rect width="800" height="600" fill="url(#papel)"/>
            <rect x="25" y="25" width="750" height="550" fill="none" stroke="url(#bronce)" stroke-width="3" stroke-dasharray="10 5" opacity="0.6"/>
            <circle cx="400" cy="240" r="100" fill="#3D291D" opacity="0.7"/>
            <path d="M400 160 L430 220 L495 230 L450 275 L460 340 L400 310 L340 340 L350 275 L305 230 L370 220 Z" fill="url(#bronce)" opacity="0.85"/>
            <circle cx="400" cy="245" r="32" fill="#1E140E"/>
            <text x="400" y="252" font-family="serif" font-size="24" fill="#E5C158" text-anchor="middle" font-weight="bold">RA</text>
            <text x="400" y="420" font-family="Outfit, serif, sans-serif" font-size="28" fill="#F4F1EA" text-anchor="middle" font-weight="bold">${tituloEsc}</text>
            <text x="400" y="460" font-family="sans-serif" font-size="18" fill="#C59B27" text-anchor="middle" letter-spacing="2">${anioEsc} · ARCHIVO HISTÓRICO AUSTRAL</text>
            <text x="400" y="500" font-family="sans-serif" font-size="13" fill="#A89F91" text-anchor="middle">Patrimonio Histórico y Cultural de Tierra del Fuego</text>
        </svg>
    `);
}

// Exportar globalmente para navegador y entornos modulares
if (typeof window !== "undefined") {
    window.SALAS_MUSEO = SALAS_MUSEO;
    window.generarSvgFallbackObra = generarSvgFallbackObra;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { SALAS_MUSEO, generarSvgFallbackObra };
}

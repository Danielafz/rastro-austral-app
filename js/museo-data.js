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
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/Strait_of_Magellan_%2847089965292%29.jpg",
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
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/HMS_Beagle_in_Straits_of_Magellan.jpg",
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
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Juli0_Popper.jpg",
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
            es: "Historia, cartografía, Puerto Soledad y soberanía del Atlántico Sur",
            en: "History, cartography, Puerto Soledad & South Atlantic sovereignty"
        },
        descripcionCorta: {
            es: "Geografía austral, asentamientos históricos pioneros y memoria viva de nuestras islas.",
            en: "Southern geography, early pioneer settlements, and living memory of our southern islands."
        },
        icono: "🌊",
        obras: [
            {
                id: "malvinas-01",
                titulo: {
                    es: "Cartografía Histórica y Soberanía Austral",
                    en: "Historical Cartography & Southern Sovereignty"
                },
                anio: "1764 - 1829",
                lugar: {
                    es: "Archipiélago de las Islas Malvinas",
                    en: "Malvinas / Falkland Islands Archipelago"
                },
                descripcion: {
                    es: "Las Islas Malvinas, integradas histórica, geográfica y jurídicamente a la provincia de Tierra del Fuego, Antártida e Islas del Atlántico Sur, cuentan con un extenso registro cartográfico y documental virreinal y republicano. En 1829, el gobierno de Buenos Aires creó la Comandancia Política y Militar bajo Luis Vernet.",
                    en: "The Malvinas Islands, constitutionally part of the province of Tierra del Fuego, Antártida e Islas del Atlántico Sur, possess documented historical administration dating back to early naval charts and Luis Vernet's 1829 governorship."
                },
                credito: "Mapoteca Histórica del Archivo General de la Nación (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Puerto_Soledad%2C_Malvinas%2C_1785.jpg",
                hitoRelacionado: {
                    es: "Plaza Malvinas e Identidad Provincial",
                    en: "Malvinas Square & Provincial Identity"
                }
            },
            {
                id: "malvinas-02",
                titulo: {
                    es: "Puerto Soledad y Primeros Asentamientos",
                    en: "Puerto Soledad & Early Settlements"
                },
                anio: "1785 - 1938",
                lugar: {
                    es: "Bahía de la Anunciación, Isla Soledad",
                    en: "Berkeley Sound, East Falkland"
                },
                descripcion: {
                    es: "Primer asentamiento fundado en el archipiélago malvinense en 1764 por Louis Antoine de Bougainville y transferido a la corona española en 1767 bajo el nombre de Puerto Soledad. Contaba con muelle, hospital, almacenes, batería de cañones y capilla, albergando a gauchos criollos dedicados a la ganadería de ganado cimarrón.",
                    en: "The first permanent settlement in the archipelago, founded in 1764 by Louis Antoine de Bougainville and administered as Puerto Soledad. It featured stone dwellings, a chapel, a battery, and was worked by skilled gauchos."
                },
                credito: "Grabado de la Real Expedición Malaspina (1789-1794) (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Puerto_Soledad_en_1938.jpeg",
                hitoRelacionado: {
                    es: "Monumento a los Héroes de Malvinas (Río Grande)",
                    en: "Malvinas Heroes Monument (Río Grande)"
                }
            },
            {
                id: "malvinas-03",
                titulo: {
                    es: "Puerto Argentino y Naturaleza Austral",
                    en: "Puerto Argentino & Southern Wildlife"
                },
                anio: "Siglo XX",
                lugar: {
                    es: "Puerto Argentino / Stanley, Isla Soledad",
                    en: "Puerto Argentino / Stanley, East Falkland"
                },
                descripcion: {
                    es: "Vista histórica del poblado costero con sus típicos tejados de chapa acanalada frente a las aguas gélidas del Atlántico Sur. El archipiélago comparte con Tierra del Fuego un ecosistema único de turberas, calafates y gigantescas colonias de aves marinas como albatros, cormoranes y pingüinos papúa y rey.",
                    en: "Historic vista of the coastal harbor with colorful rooftops facing the crisp South Atlantic. The islands share with Tierra del Fuego a rich biome of peatlands, coastal tussac grass, and teeming colonies of king and gentoo penguins."
                },
                credito: "Archivo Histórico Oceánico y Meteorológico / NOAA (Dominio Público)",
                imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Port_Stanley_1961_-_NOAA_-_Corp1373.jpg",
                hitoRelacionado: {
                    es: "Monumento a los Héroes de Malvinas (Ushuaia)",
                    en: "Malvinas Heroes Monument (Ushuaia)"
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
            <text x="400" y="420" font-family="'Outfit', serif, sans-serif" font-size="28" fill="#F4F1EA" text-anchor="middle" font-weight="bold">${tituloEsc}</text>
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

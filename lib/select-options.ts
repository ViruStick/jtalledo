export interface SelectOption {
  label: string;
  fill: Record<string, string>;
}

export const selectOptions: Record<string, SelectOption[]> = {
  Delito: [
    {
      label: "1. Acceso ilícito",
      fill: {
        Delito: "Acceso ilícito",
        Articulo_de_ley:
          "Artículo 2. Acceso ilícito, modificado por el Artículo 2 del Decreto Legislativo Nº 1614.",
        Contenido_del_articulo: `Artículo 2. Acceso ilícito
El que deliberada e ilegítimamente accede a todo o en parte de un sistema informático, o se excede en lo autorizado, será reprimido con pena privativa de libertad no menor de uno ni mayor de cuatro años y con treinta a noventa días-multa.
Si el agente accede deliberada e ilegítimamente, en todo o en parte, al sistema informático vulnerando las medidas de seguridad establecidas para impedirlo, será reprimido con pena privativa de libertad no menor de tres ni mayor de seis años y con ochenta a ciento veinte días-multa.`,
      },
    },
    {
      label: "2. Atentado a la integridad de datos informáticos",
      fill: {
        Delito: "Atentado a la integridad de datos informáticos",
        Articulo_de_ley:
          "Artículo 3. Atentado a la integridad de datos informáticos, modificado por el Artículo 1 de la Ley N° 30171.",
        Contenido_del_articulo: `Artículo 3. Atentado a la integridad de datos informáticos
El que deliberada e ilegítimamente daña, introduce, borra, deteriora, altera, suprime o hace inaccesibles datos informáticos, será reprimido con pena privativa de libertad no menor de tres ni mayor de seis años y con ochenta a ciento veinte días-multa.`,
      },
    },
    {
      label: "3. Atentado a la integridad de sistemas informáticos",
      fill: {
        Delito: "Atentado a la integridad de sistemas informáticos",
        Articulo_de_ley:
          "Artículo 4. Atentado a la integridad de sistemas informáticos, modificado por el Artículo 1 de la Ley N° 30171.",
        Contenido_del_articulo: `Artículo 4. Atentado a la integridad de sistemas informáticos
El que deliberada e ilegítimamente inutiliza, total o parcialmente, un sistema informático, impide el acceso a este, entorpece o imposibilita su funcionamiento o la prestación de sus servicios, será reprimido con pena privativa de libertad no menor de tres ni mayor de seis años y con ochenta a ciento veinte días-multa.`,
      },
    },
    {
      label:
        "4. Proposiciones a niños, niñas y adolescentes con fines sexuales por medios tecnológicos",
      fill: {
        Delito:
          "Proposiciones a niños, niñas y adolescentes con fines sexuales por medios tecnológicos",
        Articulo_de_ley:
          "Artículo 5. Proposiciones a niños, niñas y adolescentes con fines sexuales por medios tecnológicos, modificado por el Artículo 2 del Decreto Legislativo Nº 1591.",
        Contenido_del_articulo: `Artículo 5. Proposiciones a niños, niñas y adolescentes con fines sexuales por medios tecnológicos
El que a través de internet u otro medio análogo contacta con un menor de catorce años para solicitar u obtener de él material pornográfico, o para proponerle llevar a cabo cualquier acto de connotación sexual con él o con tercero, será reprimido con una pena privativa de libertad no menor de seis ni mayor de nueve años.
Cuando la víctima tiene entre catorce y menos de dieciocho años de edad y medie engaño, la pena será no menor de tres ni mayor de seis años.
En todos los casos se impone, además, la pena de inhabilitación conforme a los numerales 1, 2, 3, 4, 5, 6, 8, 9, 10 y 11 del artículo 36 del Código Penal.`,
      },
    },
    {
      label:
        "5. Chantaje sexual con materiales elaborados o modificados por medios digitales o tecnológicos",
      fill: {
        Delito:
          "Chantaje sexual con materiales elaborados o modificados por medios digitales o tecnológicos",
        Articulo_de_ley:
          "Artículo 5-A.- Chantaje sexual con materiales elaborados o modificados por medios digitales o tecnológicos, Artículo incorporado por el Artículo 4 del Decreto Legislativo Nº 1625.",
        Contenido_del_articulo: `Artículo 5-A.- Chantaje sexual con materiales elaborados o modificados por medios digitales o tecnológicos
El que, mediante el uso de tecnologías de la información o comunicación, amenaza o intimida a una persona, con la difusión de imágenes, materiales audiovisuales o audios elaborados o modificados por medios digitales o tecnológicos, para obtener de ella una conducta o acto de connotación sexual, será reprimido con pena privativa de la libertad no menor de dos ni mayor de cuatro años e inhabilitación, según corresponda, conforme a los incisos 5, 9, 10 y 11 del artículo 36 del Código Penal.
La pena privativa de libertad será no menor de tres ni mayor de cinco años e inhabilitación, cuando concurra cualquiera de las siguientes circunstancias:
1. La amenaza a la víctima se refiere a la difusión de imágenes, materiales audiovisuales o audios con contenido sexual en los que esta aparece o participa.
2. Cuando la víctima mantenga o haya mantenido una relación de pareja con el agente, son o han sido convivientes o cónyuges.
3. Cuando la víctima es menor de 18 años de edad.`,
      },
    },
    {
      label: "6. Interceptación de datos informáticos",
      fill: {
        Delito: "Interceptación de datos informáticos",
        Articulo_de_ley:
          "Artículo 7. Interceptación de datos informáticos, modificado por el Artículo 1 de la Ley N° 30171.",
        Contenido_del_articulo: `Artículo 7. Interceptación de datos informáticos
El que deliberada e ilegítimamente intercepta datos informáticos en transmisiones no públicas, dirigidos a un sistema informático, originados en un sistema informático o efectuado dentro del mismo, incluidas las emisiones electromagnéticas provenientes de un sistema informático que transporte dichos datos informáticos, será reprimido con una pena privativa de libertad no menor de tres ni mayor de seis años.
La pena privativa de libertad será no menor de cinco ni mayor de ocho años cuando el delito recaiga sobre información clasificada como secreta, reservada o confidencial de conformidad con la Ley 27806, Ley de Transparencia y Acceso a la Información Pública.
La pena privativa de libertad será no menor de ocho ni mayor de diez cuando el delito comprometa la defensa, seguridad o soberanía nacionales.
Si el agente comete el delito como integrante de una organización criminal, la pena se incrementa hasta en un tercio por encima del máximo legal previsto en los supuestos anteriores.`,
      },
    },
    {
      label: "7. Fraude informático",
      fill: {
        Delito: "Fraude informático",
        Articulo_de_ley:
          "Artículo 8. Fraude informático, modificado por el Artículo 2 del Decreto Legislativo Nº 1614.",
        Contenido_del_articulo: `Artículo 8. Fraude informático
El que deliberada e ilegítimamente procura para sí o para otro un provecho ilícito en perjuicio de tercero mediante el diseño, introducción, alteración, borrado, supresión, clonación de datos informáticos, suplantación de interfaces o páginas web o cualquier interferencia o manipulación en el funcionamiento de un sistema informático, será reprimido con una pena privativa de libertad no menor de cuatro ni mayor de ocho años y con sesenta a ciento veinte días-multa.
La pena será privativa de libertad no menor de cinco ni mayor de diez años y de ochenta a ciento cuarenta días multa cuando se afecte el patrimonio del Estado destinado a fines asistenciales o a programas de apoyo social.
La misma pena se aplica al que intencionalmente colabora con la comisión de alguno de los supuestos de los párrafos precedentes, facilitando la transferencia de activos.`,
      },
    },
    {
      label: "8. Préstamos informáticos extorsivos",
      fill: {
        Delito: "Préstamos informáticos extorsivos",
        Articulo_de_ley:
          "Artículo 8-A. Préstamos informáticos extorsivos, Artículo incorporado por el Artículo 2 de la Ley Nº 32183.",
        Contenido_del_articulo: `Artículo 8-A. Préstamos informáticos extorsivos
El que a través de plataformas digitales, internet u otro medio análogo induce u obliga mediante amenaza, intimidación, engaño o ardid a aceptar dinero o bienes, simulando un contrato de mutuo o cualquier otro con el fin de obtener una ventaja indebida, será reprimido con pena privativa de libertad no menor de diez ni mayor de quince años.
La pena será no menor de quince ni mayor de veinticinco años, cuando:
a) Se ejerce violencia para obtener la ventaja indebida.
b) La víctima tiene discapacidad, tiene entre catorce y menos de dieciocho años de edad o es adulta mayor, padece de una enfermedad grave, pertenece a un pueblo indígena u originario, o presenta cualquier situación de vulnerabilidad.
c) El agente comete el delito en el marco de la actividad de una persona jurídica.
d) La comisión del hecho punible es de carácter transnacional, de acuerdo al numeral 2 del artículo 3 de la Convención de las Naciones Unidas Contra la Delincuencia Organizada Transnacional - Convención de Palermo.`,
      },
    },
    {
      label: "9. Suplantación de identidad",
      fill: {
        Delito: "Suplantación de identidad",
        Articulo_de_ley:
          "Artículo 9. Suplantación de identidad, modificado por el Artículo 2 del Decreto Legislativo Nº 1591.",
        Contenido_del_articulo: `Artículo 9. Suplantación de identidad
El que, mediante las tecnologías digitales suplanta la identidad de una persona natural o jurídica, siempre que de dicha conducta resulte algún perjuicio, material, moral o de cualquier otra índole, será reprimido con pena privativa de libertad no menor de tres ni mayor de cinco años.
La pena privativa de libertad es no menor de seis ni mayor de nueve años cuando se suplante la identidad de una persona menor de 18 años de edad y resulte algún perjuicio, material, moral o de cualquier otra índole.`,
      },
    },
    {
      label:
        "10. Activación de una SIM Card o de una línea de servicio móvil sin consentimiento del titular",
      fill: {
        Delito:
          "Activación de una SIM Card o de una línea de servicio móvil sin consentimiento del titular",
        Articulo_de_ley:
          "Artículo 9-A.- Activación de una SIM Card o de una línea de servicio móvil sin consentimiento del titular, Artículo incorporado por el Artículo 1 de la Ley Nº 32451.",
        Contenido_del_articulo: `Artículo 9-A.- Activación de una SIM Card o de una línea de servicio móvil sin consentimiento del titular
El que, mediante sistemas informáticos u otro mecanismo, active una SIM Card o una línea de servicio móvil en la plataforma de abonados de una empresa operadora sin el consentimiento del titular, o cuando la información proporcionada del titular sea falsa o errónea, será reprimido con pena privativa de libertad no menor de cuatro ni mayor de ocho años y con inhabilitación conforme al numeral 4 del artículo 36 del Código Penal.`,
      },
    },
    {
      label: "11. Abuso de mecanismos y dispositivos informáticos",
      fill: {
        Delito: "Abuso de mecanismos y dispositivos informáticos",
        Articulo_de_ley:
          "Artículo 10. Abuso de mecanismos y dispositivos informáticos, Artículo modificado por el Artículo 1 de la Ley N° 30171.",
        Contenido_del_articulo: `Artículo 10. Abuso de mecanismos y dispositivos informáticos
El que deliberada e ilegítimamente fabrica, diseña, desarrolla, vende, facilita, distribuye, importa u obtiene para su utilización, uno o más mecanismos, programas informáticos, dispositivos, contraseñas, códigos de acceso o cualquier otro dato informático, específicamente diseñados para la comisión de los delitos previstos en la presente Ley, o el que ofrece o presta servicio que contribuya a ese propósito, será reprimido con pena privativa de libertad no menor de uno ni mayor de cuatro años y con treinta a noventa días-multa.`,
      },
    },
  ],
};

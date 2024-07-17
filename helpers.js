const mapJavaTypeToSqlType = (javaType) => {
    const typeMap = {
      "Long": "BIGINT",
      "String": "VARCHAR(255)",
      "Double": "DOUBLE",
      "BigDecimal": "DECIMAL(19,2)",
      "Date": "DATE",
      "Timestamp": "TIMESTAMP",
      "Time": "TIME",
      "Year": "YEAR",
      "Set": "SET"
    };
    return typeMap[javaType] || javaType.toUpperCase();
  };
  
  const getImports = (entityFields) => {
    const importMap = {
      "BigDecimal": "import java.math.BigDecimal;",
      "Date": "import java.util.Date;",
      "Timestamp": "import java.sql.Timestamp;",
      "Time": "import java.sql.Time;",
      "Year": "import java.time.Year;",
      "Set<String>": "import java.util.Set;",
      "Object": "import java.lang.Object;"
    };
  
    const imports = new Set();
    entityFields.forEach(field => {
      if (importMap[field.type]) {
        imports.add(importMap[field.type]);
      }
    });
  
    return Array.from(imports).join('\n');
  };
  
  module.exports = {
    mapJavaTypeToSqlType,
    getImports
  };
  
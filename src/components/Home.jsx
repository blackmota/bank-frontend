const Home = () => {
  localStorage.clear();
  
  return (
    <div>
      <h1>PrestaBanco: Sistema de solicitud de creditos hipotecarios</h1>
      <p>
        PrestaBanco es una aplicacion web que sirve para poder simular y solicitar
        prestamos Bancarios. Esta aplicación ha sido desarrollada usando tecnologías como{" "}
        <a href="https://spring.io/projects/spring-boot">Spring Boot</a> (para
        el backend), <a href="https://reactjs.org/">React</a> (para el Frontend)
        y <a href="https://www.postgresql.org/">PostgreSQL</a> (para la
        base de datos).
      </p>
      <p>Si quieres acceder a las funcionalidades, debes registrarte o iniciar sesion</p>
    </div>
    
  );
};

export default Home;

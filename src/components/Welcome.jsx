const Welcome = () => {
    const username = localStorage.getItem('user_name');
    const lastname = localStorage.getItem('user_lastname');
    const role = localStorage.getItem('permisos');

    return (
        <div>
            <p>Bienvenido {username} {lastname}, para acceder a las funcionalidades presione el menu desplegable.</p>
            {role === '2' &&
                <>
                    <p>Usted es un ejecutivo, por lo tanto tiene acceso a las siguientes funcionalidades:</p>
                    <div style={{ textAlign: 'justify' }}>
                        <p><strong>• Simular un crédito</strong></p>
                        <p><strong>• Solicitar un crédito</strong></p>
                        <p><strong>• Ver estado de sus solicitudes</strong></p>
                        <p><strong>• Aprobar o rechazar solicitudes de otros clientes</strong></p>
                    </div>
                    <p>Para acceder a ellas, presione el menu desplegable arriba a la izquierda.</p>
                </>
            }
            {role === '1' &&
                <>
                    <p>Usted es un cliente, por lo tanto tiene acceso a las siguientes funcionalidades:</p>
                    <div style={{ textAlign: 'justify' }}>
                        <p><strong>• Simular un crédito</strong></p>
                        <p><strong>• Solicitar un crédito</strong></p>
                        <p><strong>• Ver estado de sus solicitudes</strong></p>
                    </div>
                    <p>Para acceder a ellas, presione el menu desplegable arriba a la izquierda.</p>
                </>
            }
        </div>
    );
}

export default Welcome;
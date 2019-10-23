const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control')

const tikectControl = new TicketControl();

io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback)=>{

        let siguiente = tikectControl.siguiente();
        console.log( siguiente);
        callback(siguiente);
      
    })
    // emitir un evento con es estado actual
    client.emit('estadoActual', {
        actual: tikectControl.getUltimoTicket(),
        ultimos4: tikectControl.getUltimos4()
    });

    client.on('atenderTicket', (data, callback)=>{

        if (!data.escritorio) {
            return callback({
                err: true, 
                mensaje: 'El escritorio es necesario'
            })
        }
        let  atenderTicket = tikectControl.atenderTicket(data.escritorio);

        callback(atenderTicket);

        // actualizar notificar  cambos en ultimos4

        client.broadcast.emit('ultimos4', {
            ultimos4: tikectControl.getUltimos4()
        })
    })

    

});
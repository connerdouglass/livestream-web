self.addEventListener('push', event => {

    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: data.body,
        image: data.image,
        data: {
            link: data.link,
        },
    });

});

self.addEventListener('notificationclick', event => {

    console.log('On notification click: ', event.notification.data);
    event.notification.close();

    if (event.notification.data && event.notification.data.link) {
        clients.openWindow(event.notification.data.link);
    }

});

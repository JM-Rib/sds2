import React, { useState, useEffect } from 'react';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

const UserIcon = ({vote, name}) => {

    return (
        <>
            <Avatar className="p-overlay-badge" label={name} size="xlarge">
                <Badge value={vote} />
            </Avatar>
        </>
    );
}

export default UserIcon;

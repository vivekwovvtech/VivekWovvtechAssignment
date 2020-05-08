import * as React from 'react';
export const navigationRefer = React.createRef();

export function navigate(name, params)
{

    navigationRefer.current?.navigate(name, params);

} 
export function goBack()
{

    navigationRefer.current?.goBack();
}
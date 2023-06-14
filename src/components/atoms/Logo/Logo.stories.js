/* eslint-disable import/no-anonymous-default-export */
import React from 'react'
import Logo from '.'

export default {
  component: Logo,
  title: 'Components/Atoms/Logo'
}

const Template = (args) => <Logo {...args} />

export const Default = Template.bind({})
Default.args = {
  type: 'dark'
}

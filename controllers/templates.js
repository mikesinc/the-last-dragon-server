module.exports = {

  confirm: id => ({
    subject: 'The Last Dragon - Confirmation Email',
    html: `
      <a href='https://the-last-dragon.netlify.app/confirmed/${id}'>
        click to confirm email
      </a>
    `,      
    text: `Copy and paste this link: https://the-last-dragon.netlify.app/confirmed/${id}`
  })
  
}
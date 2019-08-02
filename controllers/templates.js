module.exports = {

  confirm: id => ({
    subject: 'The Last Dragon - Confirmation Email',
    html: `
      <a href='https://git.heroku.com/the-last-dragon.com/confirm/${id}'>
        click to confirm email
      </a>
    `,      
    text: `Copy and paste this link: https://git.heroku.com/the-last-dragon.com/confirm/${id}`
  })
  
}
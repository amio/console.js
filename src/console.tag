<console>
  <div class={ "lines": true }>
    <logline content={ content } />
  </div>

  <script>
    const name = 'Console.js'
    this.content = `Hello **${ name }**!`
  </script>

  <style scoped>
    :scope {
      visibility: visible;
      z-index: 99999999;
      position: fixed;
      display: block;
      width: 100%;
      transform: translate(0, -10%);
      transition: margin-top 100ms ease-out 1ms;
      background-color: rgba(0, 0, 0, 0.8);
    }
    .lines {
      position: absolute;
      bottom: 0;
    }
  </style>
</console>

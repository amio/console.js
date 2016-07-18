<console>
  <label class={ "console-panel" }>
    <div class={ "console-history" }>
      <logline class={ "logline" } type={ type } content={ content } />
    </div>
    <input class="console-input"/>
  </label>

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
    .console-panel {
      position: relative;
      display: block;
      height: 100%;
    }
    .console-history {
      position: absolute;
      bottom: 24px;
      width: 100%;
    }
    .logline,
    .console-input {
      box-sizing: border-box;
      padding: 0 5px;
      width: 100%;
      font: 14px/22px Menlo, monospace;
      color: #DDD;
      letter-spacing: 0.05em
    }
    .console-input {
      outline: none;
      position: absolute;
      border: 0;
      bottom: 2px;
      background-color: transparent;
    }
  </style>
</console>

<logline>
  <raw class={ className } content={ opts.content } />

  <script>
    this.className = 'line-' + (opts.type || 'log')
  </script>
  <style scoped>
    :scope { display: block; }
    .line-cmd { color: #7E0 }
  </style>
</logline>

<raw>
  <script>
    this.root.innerHTML = opts.content || ''
  </script>
</raw>

import * as React from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { SignatureBoard, SignatureRef } from 'signature-board'

// simple button
interface UIButtonProps {
  title: string
  name?: string
  customStyle?: ViewStyle
  fontSize?: number,
  color?: string,
  onClick?: (name: string) => void
}
const UIButton: React.FC<UIButtonProps> = ({ title, customStyle, onClick, fontSize, color, name }) => {
  const style: any = React.useMemo(() => { return { color: color || '#333', fontSize: fontSize || 14 } }, [fontSize, color])
  const handleBtn = React.useCallback(() => {
    if (onClick) onClick(name || '')
  }, [onClick])
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleBtn} style={{
      borderRadius: 20,
      flex: 1,
      height: 40,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 20,
      ...customStyle
    }}>
      <Text style={style}>{title}</Text>
    </TouchableOpacity>
  )
}
// main
const COLORS = [
  '#000',
  '#FF0',
  '#00F',
]
const BG_COLORS = [
  '#FFF',
  '#999',
]

export default function App() {
  const [size, setSize] = React.useState(10)
  const [bg, setBg] = React.useState(0)
  const [lineColor, setLineColor] = React.useState(0)
  const [img, setImg] = React.useState<string>('')
  const drawRef = React.useRef<SignatureRef | null>(null)


  const handleSize = React.useCallback((name) => {
    if (name === '0') {
      setSize(w => w + 10)
    }
    else {
      setSize(w => {
        if (w === 10) return w
        else return w - 10
      })
    }
  }, [])
  const handleColor = React.useCallback((name) => {
    const i = Number(name)
    if (!isNaN(i)) setLineColor(i)
  }, [])
  const handleBgColor = React.useCallback((name) => {
    const i = Number(name)
    if (!isNaN(i)) setBg(i)
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f1f1' }}>
        <SignatureBoard
          ref={drawRef}
          style={style.main}
          bgColor={BG_COLORS[bg]}
          lineColor={COLORS[lineColor]}
          lineWidth={size}
          onImageFinish={(res) => setImg(res)}
        />
        <View style={style.topView}>
          <Text style={style.label}>size: {size}</Text>
          <UIButton fontSize={22} name='0' title='+' onClick={handleSize} />
          <UIButton fontSize={22} name='1' title='-' onClick={handleSize} />
        </View>
        <View style={style.topView}>
          <Text style={style.label}>stroke color:</Text>
          <UIButton name="0" customStyle={{ backgroundColor: COLORS[0], borderColor: '#F00', borderWidth: lineColor !== 0 ? 0 : 5 }} title='' onClick={handleColor} />
          <UIButton name="1" customStyle={{ backgroundColor: COLORS[1], borderColor: '#F00', borderWidth: lineColor !== 1 ? 0 : 5 }} title='' onClick={handleColor} />
          <UIButton name="2" customStyle={{ backgroundColor: COLORS[2], borderColor: '#F00', borderWidth: lineColor !== 2 ? 0 : 5 }} title='' onClick={handleColor} />
        </View>
        <View style={style.topView}>
          <Text style={style.label}>bg color:</Text>
          <UIButton name="0" customStyle={{ backgroundColor: BG_COLORS[0], borderColor: '#F00', borderWidth: bg !== 0 ? 0 : 5 }} title='' onClick={handleBgColor} />
          <UIButton name="1" customStyle={{ backgroundColor: BG_COLORS[1], borderColor: '#F00', borderWidth: bg !== 1 ? 0 : 5 }} title='' onClick={handleBgColor} />
        </View>
        <View style={style.topView}>
          <Text style={style.label}>control:</Text>
          <UIButton title='clear' onClick={() => drawRef.current?.clear()} />
          <UIButton title='get image' onClick={() => drawRef.current?.getImage(false)} />
          <UIButton title='get image' onClick={() => drawRef.current?.getImage(true)} />
        </View>

      </SafeAreaView>
      { img !== '' && <View style={style.float}>
        <SafeAreaView style={style.main}>
          <Image resizeMode="contain" source={{ uri: img }} style={{ flex: 1 }} />
          <View style={style.topView}>
            <UIButton title='back' onClick={() => setImg('')} />
          </View>

        </SafeAreaView>

      </View>}
    </View>
  )
}

const style = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center'
  },
  label: {
    fontSize: 18,
  },
  float: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    flex: 1,
    backgroundColor: 'rgba(255,123,0,1)'
  }
})
package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/EEP-Benny/AdventOfCode/utils"
)

type Packet struct {
	version      int
	typeID       int
	literalValue int
	subPackets   []Packet
}

func main() {
	input := utils.LoadInput(2021, 16)
	packet, _ := parsePacket(hexToBin(input))
	fmt.Println("Solution 1:", sumPacketVersions(packet))
	// fmt.Println("Solution 2:", ???)
}

func hexToBin(hexString string) (binString string) {
	for _, hexDigit := range strings.Split(hexString, "") {
		num, _ := strconv.ParseUint(hexDigit, 16, 4)
		binString = fmt.Sprintf("%s%.4b", binString, num)
	}
	return binString
}

func binToInt(binString string) int {
	parsed, _ := strconv.ParseUint(binString, 2, 32)
	return int(parsed)
}

func parsePacket(binString string) (packet Packet, restString string) {
	restString = binString

	popBits := func(bitCount int) (bits string) {
		bits, restString = restString[:bitCount], restString[bitCount:]
		return bits
	}
	readSubPacket := func() {
		// use a variable declaration here, because we can't use := in the next line,
		// because that would create a local restString instead of overwriting the variable in the surrounding scope
		var subPacket Packet

		subPacket, restString = parsePacket(restString)
		packet.subPackets = append(packet.subPackets, subPacket)
	}

	packet.version = binToInt(popBits(3))
	packet.typeID = binToInt(popBits(3))

	if packet.typeID == 4 { // literal value
		literalBits := ""
		for popBits(1) == "1" { // more groups are coming
			literalBits += popBits(4)
		}
		literalBits += popBits(4)
		packet.literalValue = binToInt(literalBits)
	} else {
		lengthTypeId := popBits(1)
		if lengthTypeId == "0" { // total length in bytes
			lengthInBits := binToInt(popBits(15))
			expectedRemainingLength := len(restString) - lengthInBits
			for len(restString) > expectedRemainingLength {
				readSubPacket()
			}
		} else { // number of subpackets
			numberOfSubPackets := binToInt(popBits(11))
			for i := 0; i < numberOfSubPackets; i++ {
				readSubPacket()
			}
		}
	}
	return packet, restString
}

func sumPacketVersions(packet Packet) int {
	sum := packet.version
	for _, subPacket := range packet.subPackets {
		sum += sumPacketVersions(subPacket)
	}
	return sum
}
